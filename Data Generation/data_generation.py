import json
import random
import uuid

# List of post types
post_types = ["carousel", "reels", "static_image", "image", "video", "text", "text_post"]

# Function to generate random posts
def generate_posts(num_posts):
    posts = []
    for _ in range(num_posts):
        post = {
            "post_type": random.choice(post_types),
            "post_id": str(uuid.uuid4()),
            "likes": random.randint(10, 500),
            "shares": random.randint(0, 100),
            "comments": random.randint(0, 50),
        }
        posts.append(post)
    return posts

# Generate 100 posts
posts = generate_posts(50)

# Write to a JSON file
output_file = "posts.json"
with open(output_file, "w") as file:
    json.dump(posts, file, indent=4)

print(f"{len(posts)} posts have been generated and saved to {output_file}.")
