export interface TimelineItem {
  name: string;
  href: string;
  logo: any;
  logoAlt: string;
  bgColor: string;
  description: string;
}

interface TimelineEntryProps {
  item: TimelineItem;
  isLast: boolean;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ item, isLast }) => {
  return (
    <li className={`${isLast ? "" : "mb-8 sm:mb-10 lg:mb-12"} ml-4 sm:ml-6 lg:ml-8`}>
      <span
        className={`absolute -left-3 sm:-left-4 lg:-left-6 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${item.bgColor} rounded-full ring-4 sm:ring-6 lg:ring-8 ring-white`}
      >
        <img src={item.logo} alt={item.logoAlt} className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      </span>
      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 ml-3 sm:ml-3 lg:ml-1">
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {item.name}
        </a>
      </h3>
      <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{item.description}</p>
    </li>
  );
}

export default TimelineEntry;