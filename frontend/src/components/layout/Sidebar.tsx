import { XMarkIcon } from "@heroicons/react/24/outline";
import PagesMenu from "../menu/pagesMenu/PagesMenu";

type SidebarProps = {
  className?: string;
  onClose?: () => void;
  isExpanded: boolean;
};

const Sidebar = ({ className = "", onClose, isExpanded }: SidebarProps) => {
  return (
    <aside 
      className={`h-full transition-all duration-300 ease-in-out bg-white dark:bg-primary ${
        isExpanded ? "w-64" : "w-16"
      } ${className}`}
    >
      {onClose && (
        <div className="h-12 flex items-center justify-end px-4">
          <button onClick={onClose} className="lg:hidden">
            <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
          </button>
        </div>
      )}
      
      <div className="h-full overflow-y-auto">
        <PagesMenu isExpanded={isExpanded} />
      </div>
    </aside>
  );
};

export default Sidebar;
