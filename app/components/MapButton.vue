<script setup lang="ts">
defineProps<{
  lat: string;
  long: string;
}>();
</script>

<template>
  <div>
    <a
      :href="`geo:0,0?q=${lat},${long}`"
      class="inline-flex sm:hidden text-ivory bg-espresso hover:bg-ink focus:ring-4 focus:outline-none focus:ring-sand font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
    >
      <MapIcon />
      Navigálás
    </a>
    <a
      :href="`https://www.google.com/maps/search/?api=1&query=${lat},${long}`"
      target="_blank"
      rel="noopener noreferrer"
      class="hidden sm:inline-flex text-ivory bg-espresso hover:bg-ink focus:ring-4 focus:outline-none focus:ring-sand font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
    >
      <MapIcon />
      Térkép
    </a>
  </div>
</template>
