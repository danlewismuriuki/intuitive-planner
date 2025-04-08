<template>
  <q-dialog v-model="localModelValue" persistent dark>
    <q-card class="form-dialog-card" style="background: #2d2d3a; border-radius: 12px">
      <q-card-section class="bg-orange-8" style="border-radius: 12px 12px 0 0">
        <div class="text-h6 text-white">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <slot></slot>
      </q-card-section>

      <q-card-actions align="right" class="bg-light q-pa-md">
        <q-btn flat label="Cancel" color="grey" @click="onCancel" />
        <q-btn flat label="Save" color="orange" @click="onSave" :disable="!isValid" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'FormDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    isValid: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'save', 'cancel'],
  setup(props, { emit }) {
    const localModelValue = ref(props.modelValue);

    watch(localModelValue, (newValue) => {
      emit('update:modelValue', newValue);
    });

    watch(() => props.modelValue, (newValue) => {
      localModelValue.value = newValue;
    });

    const onSave = () => {
      emit('save');
    };

    const onCancel = () => {
      emit('cancel');
      localModelValue.value = false;
    };

    return {
      localModelValue,
      onSave,
      onCancel
    };
  }
});
</script>

<style lang="scss" scoped>
.form-dialog-card {
  width: 500px;
  max-width: 95vw;
}

@media (max-width: 600px) {
  .form-dialog-card {
    width: 95vw;
    margin: 10px;
  }
}

@media (max-width: 400px) {
  .form-dialog-card {
    width: 98vw;
    margin: 5px;
  }
}
</style>
