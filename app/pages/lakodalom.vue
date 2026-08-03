<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Lakodalom</PageHeading>
    </header>
    <VenuePlaceholder class="mt-4" />
    <div class="w-full mt-5 px-4">
      <div class="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 justify-center text-ink">
        <div class="text-center">
          <h3 class="text-lg font-semibold">Lóvasút Kulturális és Rendezvényközpont</h3>
          <div>{{ address }}</div>
          <div class="mt-2">A templomtól csupán pár perc sétára.</div>
          <!-- TODO: add a MapButton here once the Lóvasút coordinates are known — see eskuvo.vue for the pattern -->
        </div>
      </div>
    </div>
    <HighlightStrip>
      <MiddleHeading>Parkolás</MiddleHeading>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <span class="text-center">TODO: parkolási információ</span>
      </div>
    </HighlightStrip>
  </div>
</template>

<script lang="ts" setup>
const title = 'Lakodalom helyszín';
const address = 'TODO: cím';
const description = 'Lóvasút Kulturális és Rendezvényközpont — a templomtól pár perc sétára';

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/lakodalom',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
