<template>
  <div class="lock-icon"></div>
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
  },
  setup(props) {
    const toggle = ref(true);

    const onToggleClick = function () {
      toggle.value = !toggle.value;
    };
    return {
      toggle,
      onToggleClick,
    };
  },
});
</script>
