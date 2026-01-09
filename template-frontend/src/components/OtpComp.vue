<template>
  <div class="row justify-center q-gutter-sm">
    <div v-for="(digit, index) in otp" :key="index" class="col dimension-40">
      <q-input
        v-model="otp[index]"
        mask="#"
        maxlength="1"
        outlined
        dense
        class="fit"
        type="tel"
        input-class="text-center text-primary"
        :ref="(el: VNodeRef) => (otpRef[index] = el)"
        @keydown="(event: KeyboardEvent) => handleKeyPress(event, index)"
        @paste="(event: ClipboardEvent) => handlePaste(event, index)"
        :autofocus="index === 0"
      />
      <q-separator :color="otp[index] ? 'primary' : 'grey-6'" class="q-mt-sm br-4" size="4px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { QInput } from 'quasar';
import type { VNodeRef } from 'vue';
import { onMounted, ref } from 'vue';

const props = defineProps({
  length: {
    type: Number,
    default: 4,
  },
});
onMounted(() => {
  setTimeout(() => {
    if (otpRef.value[0]) {
      (otpRef.value[0] as unknown as QInput)?.focus();
    }
  }, 500);
});
const emit = defineEmits(['update:modelValue']);

const otp = ref<string[]>(Array(props.length).fill(''));
const otpRef = ref<(VNodeRef | undefined)[]>(Array(props.length).fill(null));

const handleKeyPress = (event: KeyboardEvent, index: number): void => {
  const key = event.key;

  // Allow paste shortcut keys (Ctrl+V / Cmd+V)
  if ((event.ctrlKey || event.metaKey) && key.toLowerCase() === 'v') {
    return;
  }

  if (key >= '0' && key <= '9') {
    otp.value[index] = key; // Replace with new key
    if (index < props.length - 1) {
      (otpRef.value[index + 1] as unknown as QInput)?.focus(); // Focus next input
    }
  } else if (key === 'Backspace') {
    otp.value[index] = ''; // Clear current field
    if (index > 0) {
      (otpRef.value[index - 1] as unknown as QInput)?.focus(); // Focus previous input
    }
  } else if (key === 'ArrowLeft' && index > 0) {
    (otpRef.value[index - 1] as unknown as QInput)?.focus(); // Navigate left
  } else if (key === 'ArrowRight' && index < props.length - 1) {
    (otpRef.value[index + 1] as unknown as QInput)?.focus(); // Navigate right
  }

  if (index === props.length - 1) {
    emit('update:modelValue', otp.value.join(''));
  }
  event.preventDefault();
};

const handlePaste = (event: ClipboardEvent, index: number): void => {
  const pasteData = event.clipboardData?.getData('text') || '';
  const digits = pasteData.replace(/[^0-9]/g, '').slice(0, props.length);

  if (index === 0 && digits.length && digits.length === props.length) {
    for (let i = 0; i < digits.length; i++) {
      if (i < props.length) {
        if (digits.charAt(i)) otp.value[i] = digits.charAt(i);
      }
    }
    emit('update:modelValue', otp.value.join(''));

    // Automatically focus the next input after filling
    const nextIndex = Math.min(digits.length - 1, props.length - 1);
    (otpRef.value[nextIndex] as unknown as QInput)?.focus();
  }

  event.preventDefault();
};

defineExpose({
  reset: () => {
    otp.value = Array(props.length).fill('');
    emit('update:modelValue', otp.value.join(''));
  },
});
</script>
