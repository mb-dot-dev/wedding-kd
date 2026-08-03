<template>
  <div>
    <nav class="bg-espresso p-4">
      <ul class="flex flex-wrap justify-center gap-4 text-ivory">
        <li><a href="/">Köszöntő</a></li>
        <li><a href="/eskuvo">Esküvő</a></li>
        <li><a href="/lakodalom">Lakodalom</a></li>
        <li><a href="/naszajandek">Nászajándék</a></li>
        <li><a href="/visszajelzes">Visszajelzés</a></li>
      </ul>
    </nav>
    <main><slot /></main>
  </div>
</template>
