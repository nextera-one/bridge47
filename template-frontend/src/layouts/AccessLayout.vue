<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent q-gutter-x-sm">
      <q-toolbar>
        <q-toolbar-title> {{ $toTitleCase($route.path) }} </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>
