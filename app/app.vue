<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
  title: 'Kata és Domi',
  titleTemplate: '%s | Kata és Domi',
  htmlAttrs: { lang: 'hu' },
  bodyAttrs: {
    style: 'background-color: var(--color-ivory)',
  },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&family=Ysabeau:ital,wght@0,1..1000;1,1..1000&display=swap',
    },
  ],
});
</script>
