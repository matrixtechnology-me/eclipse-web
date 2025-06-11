const tenantId = "1a6b1e60-aaae-4ba2-9b0f-f67529049900";
const apiKey = "GVGxy1wtrgPgtyny6GzTZsGGB1hhLMPa8MT3e56W9TvBj8NCuo";
const basicToken = Buffer.from(`${tenantId}:${apiKey}`).toString('base64');
console.log(`Basic ${basicToken}`);