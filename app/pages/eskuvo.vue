<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Esküvő</PageHeading>
    </header>
    <VenuePlaceholder class="mt-4" />
    <div class="w-full mt-5">
      <div class="flex flex-col md:flex-row gap-4 justify-center text-ink">
        <div class="text-center">
          <h3>Zugligeti Szent Család Plébánia</h3>
          <div>{{ address }}</div>
          <div class="mt-2">Kezdés: tervezetten 14:30</div>

          <MapButton class="mt-4 flex justify-center" lat="47.51687720938038" long="18.985569587647085" />
        </div>
      </div>
    </div>
    <HighlightStrip>
      <MiddleHeading>Parkolás</MiddleHeading>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <span class="text-center">
          A templom utcájában és a játszótér túloldalán, a Zugligeti úton is lehet parkolni. (TODO: megerősíteni)
        </span>
      </div>
    </HighlightStrip>
  </div>
</template>

<script lang="ts" setup>
const title = 'Esküvő helyszín';
const address = '1125. Szarvas Gábor út 52.';
const description = `Kezdés: tervezetten 14:30, cím: ${address}`;

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/eskuvo',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
