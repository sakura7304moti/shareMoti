<template>
  <div class="lock-icon">
    <a
      href="#"
      @click.prevent="onToggleClick"
      style="text-decoration: none"
      class="row q-gutter-xs"
    >
      <q-icon v-if="toggle" name="lock" size="sm" color="secondary" />
      <q-icon v-else name="lock_open" size="sm" color="secondary" />
      <div class="text-subtitle text-black">{{ iconText }}</div>
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'LockIcon',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const toggle = ref(props.modelValue);
    const iconText = ref(props.label ?? '');

    const onToggleClick = function () {
      toggle.value = !toggle.value;
    };
    return {
      toggle,
      iconText,
      onToggleClick,
    };
  },
});
</script>
