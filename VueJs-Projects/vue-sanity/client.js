import sanityClient from "@sanity/client";

export const urlFor = (source) => {
    return imageBuilder.image(source);
}

export default sanityClient({
    projectId: import.meta.env.VITE_STUDIO_API_PROJECT_ID,
    dataset: import.meta.env.VITE_STUDIO_API_DATASET,
    useCdn: true,
});