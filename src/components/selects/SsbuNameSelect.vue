<template>
  <q-select
    v-model="selectedValue"
    :options="selectOptions"
    dense
    stack-label
    :label="selectLabel"
    :style="{ width: selectWidth + 'px' }"
    transition-show="jump-up"
    transition-hide="jump-up"
  >
    <template v-slot:append>
      <q-icon
        id="ssbu-select-clear-icon"
        v-if="selectedValue != ''"
        name="clear"
        @click.stop.prevent="selectedValue = ''"
      />
    </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import api from '../../api/NameListApi';

export default defineComponent({
  name: 'ssbu-char-select',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: 'キャラ名',
    },
    width: {
      type: Number,
      required: false,
      default: 200,
    },
  },
  setup(props, { emit }) {
    /*APIからキャラ名の一覧を取得 */
    const selectOptions = ref([] as string[]);
    const getNames = async function () {
      await api
        .ssbu_names()
        .then((response) => {
          if (response) {
            console.log('ssbu-names', response);
            selectOptions.value = response;
          }
        })
        .catch((e) => {
          console.log('err', e);
        });
    };

    // selectOptionsの変更を監視し、modelValueに反映
    watch(selectOptions, (newOptions) => {
      // conditionが選択肢に含まれていない場合、最初の選択肢を選択
      if (!newOptions.includes(props.modelValue)) {
        selectedValue.value = '';
      }
    });

    // 初期化時にキャラ名を取得
    getNames();

    // selectedValueをmodelValueに反映
    const selectedValue = ref(props.modelValue);
    watch(selectedValue, (newValue) => {
      emit('update:modelValue', newValue);
    });

    return {
      /*props */
      selectedValue,
      selectLabel: ref(props.label),
      selectWidth: ref(props.width),
      /*datas */
      selectOptions,
    };
  },
});
</script>
<style lang="scss">
#ssbu-select-clear-icon {
  color: grey;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
#ssbu-select-clear-icon:hover {
  color: $primary;
}
</style>
