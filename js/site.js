
// site.js - Fetch data from Sanity instead of local JSON

import sanityClient from "https://cdn.skypack.dev/@sanity/client";

// Initialize Sanity client
const client = sanityClient({
  projectId: "k8s035wf", // Your Project ID
  dataset: "production", // Dataset name
  apiVersion: "2025-08-14", // Use today's date for fresh cache
  useCdn: true // true = faster, cached data
});

// Load Products
async function loadProducts() {
  const products = await client.fetch(`*[_type == "product"]{
    title,
    description,
    price,
    category,
    "image": image.asset->url
  }`);

  const container = document.querySelector("#products-container");
  if (container) {
    container.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <span>${p.price}</span>
      </div>
    `).join("");
  }
}

// Load Recipes
async function loadRecipes() {
  const recipes = await client.fetch(`*[_type == "recipe"]{
    title,
    instructions,
    "image": image.asset->url
  }`);

  const container = document.querySelector("#recipes-container");
  if (container) {
    container.innerHTML = recipes.map(r => `
      <div class="recipe-card">
        <img src="${r.image}" alt="${r.title}">
        <h3>${r.title}</h3>
        <p>${r.instructions}</p>
      </div>
    `).join("");
  }
}

// Load Testimonials
async function loadTestimonials() {
  const testimonials = await client.fetch(`*[_type == "testimonial"]{
    name,
    message,
    "image": image.asset->url
  }`);

  const container = document.querySelector("#testimonials-container");
  if (container) {
    container.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <img src="${t.image}" alt="${t.name}">
        <blockquote>${t.message}</blockquote>
        <cite>${t.name}</cite>
      </div>
    `).join("");
  }
}

// Load Site Info (Header/Footer)
async function loadSiteInfo() {
  const siteInfo = await client.fetch(`*[_type == "siteInfo"][0]{
    title,
    contactEmail,
    contactPhone
  }`);

  if (document.querySelector("#site-title")) {
    document.querySelector("#site-title").textContent = siteInfo.title;
  }
  if (document.querySelector("#contact-email")) {
    document.querySelector("#contact-email").textContent = siteInfo.contactEmail;
  }
  if (document.querySelector("#contact-phone")) {
    document.querySelector("#contact-phone").textContent = siteInfo.contactPhone;
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadRecipes();
  loadTestimonials();
  loadSiteInfo();
});
