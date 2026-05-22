import TimelineEntry from "./TimelineEntry";
import type { TimelineItem } from "./TimelineEntry";


// Bilder 
import kaggleLogo from "../../Assets/Images/kaggle.png";
import metaLogo from "../../Assets/Images/meta.png";
import qdrantLogo from "../../Assets/Images/qdrant.png";
import tailwindLogo from "../../Assets/Images/tailwind.png"
import reactLogo from "../../Assets/Images/react.png"
import rustfsLogo from "../../Assets/Images/rustfs.png"

const items: TimelineItem[] = [
  {
    name: "Kaggle",
    href: "https://www.kaggle.com/datasets/adityajn105/flickr30k",
    logo: kaggleLogo,
    logoAlt: "Kaggle Logo",
    bgColor: "bg-gray-800",
    description: "30,000 Flickr images serve as the starting point for the image search.",
  },
  {
    name: "DINOv2",
    href: "https://github.com/facebookresearch/dinov2",
    logo: metaLogo,
    logoAlt: "Meta Logo",
    bgColor: "bg-blue-600",
    description: "Image Vectorizer converts images into high-dimensional embeddings using Vision Transformer.",
  },
  {
    name: "Qdrant",
    href: "https://github.com/qdrant/qdrant",
    logo: qdrantLogo,
    logoAlt: "Qdrant",
    bgColor: "bg-gray-800",
    description: "Vector Database stores the embeddings for fast similarity searches.",
  },
  {
    name: "React",
    href: "https://github.com/facebook/react",
    logo: reactLogo,
    logoAlt: "React",
    bgColor: "bg-gray-800",
    description: "Website for searching and displaying results.",
  },
  {
    name: "Tailwind CSS",
    href: "https://tailwindcss.com",
    logo: tailwindLogo,
    logoAlt: "Tailwind CSS",
    bgColor: "bg-gray-800",
    description: "Ensures a modern design of the user interface.",
  },
];

const TechTimeline = () => {
  return (
    <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol className="relative border-l-2 sm:border-l-4 border-gray-300">
        {items.map((item, index) => (
          <TimelineEntry key={item.name} item={item} isLast={index === items.length - 1} />
        ))}
      </ol>
    </div>
  );
}

export default TechTimeline;