<template>
  <div class="container">
    <!-- Loader -->
    <div v-if="loading" class="py-5">
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-info" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    
    <!-- Display fetched data here -->
    <article v-if="post" class="my-5 bg-light-subtle shadow-sm rounded p-5">
      <h3 class="h1 text-center">{{ post.title }}</h3>
      <p class="text-center">
        <img v-if="post.authorImage" :src="urlFor(post.authorImage)" class="rounded-circle" height="28" width="28" alt="PostImage" loading="lazy"/> 
        {{ post.authorName }} 
        <span class="text-body-secondary mx-2">
          <i class="bi bi-alarm"></i> {{ formattedDate }}
        </span>
      </p>
      <div class="container my-5">
        <img class="img-thumbnail" v-if="post.mainImage" :src="urlFor(post.mainImage)" alt="Main Image" />
      </div>
      <!-- <div class="mx-3" v-html="getBodyContent(post.body)"></div> -->
      <SanityBlocks :blocks="blocks" />
    </article>
  </div>
</template>

<script>
import { SanityBlocks } from "sanity-blocks-vue-component";
import sanity from "../../client.js";
import imageUrlBuilder from "@sanity/image-url";

export default {
  name: "SingleBlogPost",
  components: { SanityBlocks },
  data() {
    return {
      post: [],
      blocks: [],
      formattedDate: '',
      loading: true // Set loading state to true initially
    };
  },
  created() {
    this.fetchPost();
  },
  methods: {
    urlFor(source) {
      const builder = imageUrlBuilder(sanity);
      return builder.image(source);
    },
    fetchPost() {
      const slug = this.$route.params.slug;
      const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        "authorName": author->name,
        "authorImage": author->image,
        mainImage,
        publishedAt,
        body
      }`;
      
      sanity
        .fetch(query, { slug })
        .then((post) => {
          this.post = post;
          this.blocks = post.body;
          this.setDocumentTitle(post.title); // Set document title with post title
          this.formatDate(post.publishedAt); // Format the published date
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
        })
        .finally(() => {
          this.loading = false; // Set loading state to false after fetching
        });
    },
    getBodyContent(blocks) {
      let content = "";
      blocks.forEach((block) => {
        if (block._type === "block" && block.children) {
          block.children.forEach((child) => {
            if (child._type === "span" && child.text) {
               // Append HTML content with span tags
          content += `<span>${child.text}</span>`;
            }
          });
        }
      });
      return content;
    },
    setDocumentTitle(title) {
      document.title = title; // Set document title to the post title
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      this.formattedDate = `${month} ${day}, ${year}`;
    }
  },
  // Using beforeRouteEnter to set document title before entering the route
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.post) {
        vm.setDocumentTitle(vm.post.title);
        vm.formatDate(vm.post.publishedAt);
      }
    });
  },
  // Using beforeRouteUpdate to set document title before updating the route
  beforeRouteUpdate(to, from, next) {
    if (this.post) {
      this.setDocumentTitle(this.post.title);
      this.formatDate(this.post.publishedAt);
    }
    next();
  }
};
</script>


