<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Nászajándék</PageHeading>
    </header>

    <div class="w-full mt-5 px-4">
      <div class="max-w-2xl mx-auto flex flex-col gap-4 justify-center text-ink">
        <div class="text-center">
          Háztartásunk teljes, nem is vágyunk másra <br />
          Csak közös életünk kezdetén egy kis támogatásra!
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold">TODO: név</h3>
          <div>bankszámlaszám: TODO: bankszámlaszám</div>
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold">Revolut link/tag:</h3>
          <!-- TODO: <RevolutLinkButton class="mt-2 flex justify-center" tag="..." currency="huf" amount="1000" note="nászajándék" /> once the Revolut tag is known -->
          TODO: Revolut tag
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const title = 'Nászajándék';
const description = 'Kata és Domi esküvője';

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/naszajandek',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
