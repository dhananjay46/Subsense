import { BottomSheetTextInput, type BottomSheetModal } from '@gorhom/bottom-sheet';
import { addMonths, addYears, format } from 'date-fns';
import { forwardRef, useEffect, useRef, useState, type Ref } from 'react';
import { View } from 'react-native';

import { triggerHaptic } from '@/lib/haptics';
import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import { colors, fonts, radius } from '@/lib/tokens';
import { categoryLabel } from '@/lib/utils';
import type {
  BillingCycle,
  Subscription,
  SubscriptionCategory,
  SubscriptionDraft,
} from '@/types/subscription';

import { Button } from './button';
import { Chip } from './chip';
import { Sheet } from './sheet';
import { Text } from './text';

export type SubscriptionFormSheetProps = {
  ref?: Ref<BottomSheetModal>;
  existing: Subscription | null;
  onDismiss?: () => void;
};

const CATEGORIES: SubscriptionCategory[] = [
  'entertainment',
  'music',
  'productivity',
  'cloud',
  'finance',
  'other',
];

const CYCLES: BillingCycle[] = ['monthly', 'quarterly', 'yearly'];
const CYCLE_LABEL: Record<BillingCycle, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};
const FORM_SNAP = ['92%'];
const DAY_PRESETS = [1, 3, 7, 14, 30] as const;
const OWNER_PRESETS = ['Me', 'Shared with family'] as const;

type RenewalPreset = `${(typeof DAY_PRESETS)[number]}d` | '1m' | '3m' | '1y' | null;

type FormState = {
  name: string;
  planName: string;
  priceText: string;
  category: SubscriptionCategory;
  billingCycle: BillingCycle;
  renewalDate: Date;
  renewalPreset: RenewalPreset;
  isTrial: boolean;
  owner: string;
  cancelUrl: string;
};

function toForm(existing: Subscription | null): FormState {
  if (existing) {
    return {
      name: existing.name,
      planName: existing.planName,
      priceText: existing.price.toString(),
      category: existing.category,
      billingCycle: existing.billingCycle,
      renewalDate: existing.renewalDate,
      renewalPreset: null,
      isTrial: Boolean(existing.isTrial),
      owner: existing.owner ?? '',
      cancelUrl: existing.cancelUrl ?? '',
    };
  }
  return {
    name: '',
    planName: '',
    priceText: '',
    category: 'entertainment',
    billingCycle: 'monthly',
    renewalDate: addMonths(new Date(), 1),
    renewalPreset: '1m',
    isTrial: false,
    owner: 'Me',
    cancelUrl: '',
  };
}

function parseDraft(form: FormState): SubscriptionDraft | null {
  const name = form.name.trim();
  const planName = form.planName.trim() || 'Standard';
  const price = Number(form.priceText.replace(/[^\d.]/g, ''));
  if (!name) return null;
  if (!Number.isFinite(price) || price <= 0) return null;
  const cancelUrl = form.cancelUrl.trim();
  return {
    name,
    planName,
    price,
    billingCycle: form.billingCycle,
    category: form.category,
    renewalDate: form.renewalDate,
    isTrial: form.isTrial,
    owner: form.owner.trim() || undefined,
    cancelUrl: cancelUrl || undefined,
  };
}

export const SubscriptionFormSheet = forwardRef<BottomSheetModal, SubscriptionFormSheetProps>(
  function SubscriptionFormSheet({ existing, onDismiss }, ref) {
    return (
      <FormSheetHost ref={ref} existing={existing} onDismiss={onDismiss} />
    );
  },
);

type FormSheetHostProps = {
  existing: Subscription | null;
  onDismiss?: () => void;
};

const FormSheetHost = forwardRef<BottomSheetModal, FormSheetHostProps>(function FormSheetHost(
  { existing, onDismiss },
  ref,
) {
  const add = useSubscriptionsStore((s) => s.add);
  const update = useSubscriptionsStore((s) => s.update);
  const [form, setForm] = useState<FormState>(() => toForm(existing));
  const latestExistingId = useRef(existing?.id ?? null);

  useEffect(() => {
    if (existing?.id !== latestExistingId.current) {
      latestExistingId.current = existing?.id ?? null;
      setForm(toForm(existing));
    }
  }, [existing]);

  const dismiss = () => {
    const node = ref as { current: BottomSheetModal | null } | null;
    node?.current?.dismiss();
  };

  const draft = parseDraft(form);
  const canSave = draft !== null;

  const onSave = () => {
    if (!draft) return;
    triggerHaptic('medium');
    if (existing) {
      update(existing.id, draft);
    } else {
      add(draft);
    }
    dismiss();
  };

  const footer = (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Button
          label="Cancel"
          variant="secondary"
          onPress={dismiss}
          labelClassName="text-[16px] leading-[22px]"
        />
      </View>
      <View className="flex-1">
        <Button
          label={existing ? 'Save' : 'Add subscription'}
          onPress={onSave}
          disabled={!canSave}
          accessibilityHint="Saves this subscription"
          labelClassName="text-[16px] leading-[22px]"
        />
      </View>
    </View>
  );

  return (
    <Sheet
      ref={ref}
      accessibilityLabel={existing ? 'Edit subscription' : 'Add subscription'}
      snapPoints={FORM_SNAP}
      scrollable
      footer={footer}
      onDismiss={onDismiss}>
      <FormBody form={form} setForm={setForm} existing={existing} />
    </Sheet>
  );
});

type FormBodyProps = {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  existing: Subscription | null;
};

function FormBody({ form, setForm, existing }: FormBodyProps) {
  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text variant="display-md" accessibilityRole="header">
          {existing ? 'Edit subscription' : 'Add subscription'}
        </Text>
        <Text variant="body" tone="muted">
          A few details and we&apos;ll track the next renewal for you.
        </Text>
      </View>

      <Field label="Name">
        <Input
          value={form.name}
          onChangeText={(name) => setForm((f) => ({ ...f, name }))}
          placeholder="Netflix"
          autoCapitalize="words"
          returnKeyType="next"
        />
      </Field>

      <Field label="Plan">
        <Input
          value={form.planName}
          onChangeText={(planName) => setForm((f) => ({ ...f, planName }))}
          placeholder="Premium"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </Field>

      <Field label="Price (₹)">
        <Input
          value={form.priceText}
          onChangeText={(priceText) =>
            setForm((f) => ({ ...f, priceText: priceText.replace(/[^\d.]/g, '') }))
          }
          placeholder="649"
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
      </Field>

      <Field label="Billing cycle">
        <View className="flex-row flex-wrap gap-2">
          {CYCLES.map((cycle) => (
            <Chip
              key={cycle}
              label={CYCLE_LABEL[cycle]}
              selected={form.billingCycle === cycle}
              onPress={() => setForm((f) => ({ ...f, billingCycle: cycle }))}
              accessibilityLabel={`Billed ${CYCLE_LABEL[cycle].toLowerCase()}`}
            />
          ))}
          <Chip
            label="Free trial"
            selected={form.isTrial}
            onPress={() => setForm((f) => ({ ...f, isTrial: !f.isTrial }))}
            accessibilityLabel="Mark as free trial"
          />
        </View>
      </Field>

      <Field label="Category">
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={categoryLabel[category]}
              selected={form.category === category}
              onPress={() => setForm((f) => ({ ...f, category }))}
            />
          ))}
        </View>
      </Field>

      <Field label={`Renews on ${format(form.renewalDate, 'EEE, d MMM yyyy')}`}>
        <View className="flex-row flex-wrap gap-2">
          {DAY_PRESETS.map((days) => {
            const presetKey = `${days}d` as RenewalPreset;
            return (
              <Chip
                key={days}
                label={`+${days}d`}
                selected={form.renewalPreset === presetKey}
                onPress={() =>
                  setForm((f) => ({
                    ...f,
                    renewalDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                    renewalPreset: presetKey,
                  }))
                }
                accessibilityLabel={`Renew in ${days} days`}
              />
            );
          })}
          <Chip
            label="+1 month"
            selected={form.renewalPreset === '1m'}
            onPress={() =>
              setForm((f) => ({
                ...f,
                renewalDate: addMonths(new Date(), 1),
                renewalPreset: '1m',
              }))
            }
          />
          <Chip
            label="+3 months"
            selected={form.renewalPreset === '3m'}
            onPress={() =>
              setForm((f) => ({
                ...f,
                renewalDate: addMonths(new Date(), 3),
                renewalPreset: '3m',
              }))
            }
          />
          <Chip
            label="+1 year"
            selected={form.renewalPreset === '1y'}
            onPress={() =>
              setForm((f) => ({
                ...f,
                renewalDate: addYears(new Date(), 1),
                renewalPreset: '1y',
              }))
            }
          />
        </View>
      </Field>

      <Field label="Paid by">
        <View className="gap-2">
          <View className="flex-row flex-wrap gap-2">
            {OWNER_PRESETS.map((owner) => (
              <Chip
                key={owner}
                label={owner}
                selected={form.owner === owner}
                onPress={() => setForm((f) => ({ ...f, owner }))}
              />
            ))}
          </View>
          <Input
            value={form.owner}
            onChangeText={(owner) => setForm((f) => ({ ...f, owner }))}
            placeholder="Me, Arjun, Shared…"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>
      </Field>

      <Field label="Cancel link (optional)">
        <Input
          value={form.cancelUrl}
          onChangeText={(cancelUrl) => setForm((f) => ({ ...f, cancelUrl }))}
          placeholder="https://..."
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
        />
      </Field>

    </View>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <View className="gap-2">
      <Text variant="micro" tone="subtle">
        {label}
      </Text>
      {children}
    </View>
  );
}

type InputProps = React.ComponentProps<typeof BottomSheetTextInput>;

function Input(props: InputProps) {
  return (
    <BottomSheetTextInput
      placeholderTextColor={colors.subtle}
      {...props}
      style={[
        {
          height: 48,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.line,
          backgroundColor: colors.surface,
          paddingHorizontal: 16,
          fontFamily: fonts.sans,
          fontSize: 17,
          color: colors.ink,
        },
        props.style,
      ]}
    />
  );
}
