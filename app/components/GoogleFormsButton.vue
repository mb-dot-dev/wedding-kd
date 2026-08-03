<script setup lang="ts">
defineProps<{
  link: string;
}>();
</script>

<template>
  <div>
    <a
      :href="link"
      class="inline-flex text-ivory bg-espresso hover:bg-ink focus:ring-4 focus:outline-none focus:ring-sand font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
    >
      <FormsIcon />
      Visszajelzés küldése
    </a>
  </div>
</template>
