<template>

    <v-toolbar density="compact">
      <v-navigation-drawer
        v-model="drawer"
        temporary
         @click:outside="drawer = false"
      >
        <v-list :items="items"></v-list>
      </v-navigation-drawer>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      drawer: false,
      items: [
        { title: 'Foo', value: 'foo' },
        { title: 'Bar', value: 'bar' },
        { title: 'Fizz', value: 'fizz' },
        { title: 'Buzz', value: 'buzz' },
      ],
    };
  },
};
</script>

<style>
/* Add any additional styles if needed */
</style>
