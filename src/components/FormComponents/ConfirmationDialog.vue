<template>
  <q-dialog v-model="localModelValue" persistent dark>
    <q-card class="confirmation-dialog-card" style="background: #2d2d3a; border-radius: 12px">
      <q-card-section class="row items-center q-pa-lg">
        <q-icon name="warning" color="orange" size="2em" class="q-mr-md" />
        <span class="text-white">{{ message }}</span>
      </q-card-section>

      <q-card-actions align="right" class="bg-light q-pa-md">
        <q-btn flat :label="cancelLabel" color="grey" @click="onCancel" />
        <q-btn flat :label="confirmLabel" color="orange" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'ConfirmationDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    confirmLabel: {
      type: String,
      default: 'DELETE'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const localModelValue = ref(props.modelValue);

    watch(localModelValue, (newValue) => {
      emit('update:modelValue', newValue);
    });

    watch(() => props.modelValue, (newValue) => {
      localModelValue.value = newValue;
    });

    const onConfirm = () => {
      emit('confirm');
      localModelValue.value = false;
    };

    const onCancel = () => {
      emit('cancel');
      localModelValue.value = false;
    };

    return {
      localModelValue,
      onConfirm,
      onCancel
    };
  }
});
</script>

<style lang="scss" scoped>
.confirmation-dialog-card {
  width: 400px;
  max-width: 90vw;
}

@media (max-width: 600px) {
  .confirmation-dialog-card {
    width: 90vw;
    margin: 10px;
  }
}

@media (max-width: 400px) {
  .confirmation-dialog-card {
    width: 98vw;
    margin: 5px;
  }
}
</style>
