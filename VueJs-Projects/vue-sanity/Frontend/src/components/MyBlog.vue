<script setup>
import Header from "./HeaDer.vue";
</script>
<template>
  <Header title="Read My Blogs" />

  <div class="container">
    <div class="py-5" v-if="loading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-info" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else-if="error">
      <p>Error: {{ error.message }}</p>
    </div>
    <div v-else>
      <div class="post my-5">
        <!-- post card starts -->
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col" v-for="post in posts" :key="post._id" >
            <div class="card h-100">
              <img  v-if="post.mainImage" :src="urlFor(post.mainImage)"class="card-img-top" alt="PostImage" loading="lazy" />
              <div class="card-body">
                <h3 class="card-title text-center">{{ post.title }}</h3>
                <div class="d-grid gap-2 mt-4 col-8 mx-auto">
                    <RouterLink :to="'/blog/' + post.slug" type="button" class="btn btn-info">
                        View Blog
                    </RouterLink>
                </div>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary"
                  > Posted by    <img  v-if="post.authorImage" :src="urlFor(post.authorImage)"class="rounded-circle" height="28" width="28" alt="PostImage" loading="lazy"/> {{ post.authorName }}</small
                >
              </div>
            </div>
          </div>
        </div>
        <!-- post card ends -->
    
        <!-- <div v-html="getBodyContent(post.body)"></div> -->
        
      </div>
    </div>
  </div>
</template>

<script>
import {RouterLink } from 'vue-router';
import sanity from "../../client.js";
import imageUrlBuilder from "@sanity/image-url";

export default {
    components: {
    RouterLink
  },
  data() {
    return {
      loading: true,
      posts: [],
      error: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    urlFor(source) {
      const builder = imageUrlBuilder(sanity);
      return builder.image(source);
    },
    fetchData() {
      const query = `*[_type == "post"]{
        _id,
        title,
        "authorName": author->name,
        "authorImage": author->image,
        mainImage,
        "slug": slug.current,
        body
      }`;

      this.loading = true;
      this.error = null;

      sanity
        .fetch(query)
        .then((posts) => {
          this.loading = false;
          this.posts = posts;
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
    },
    getBodyContent(blocks) {
      let content = "";
      blocks.forEach((block) => {
        if (block._type === "block" && block.children) {
          block.children.forEach((child) => {
            if (child._type === "span" && child.text) {
              content += child.text;
            }
          });
        }
      });
      return content;
    },
  },
};
</script>
