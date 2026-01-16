from PIL import Image
import os
import sys

def process_image(input_path, output_path, max_size=(800, 800)):
    """
    Process uploaded image: resize and optimize
    """
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # Resize maintaining aspect ratio
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Save optimized image
            img.save(output_path, 'JPEG', quality=85, optimize=True)

        return True
    except Exception as e:
        print(f"Error processing image: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python image_processor.py <input_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if process_image(input_path, output_path):
        print("Image processed successfully")
    else:
        print("Image processing failed")
        sys.exit(1)