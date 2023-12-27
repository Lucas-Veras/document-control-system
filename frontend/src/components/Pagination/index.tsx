import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
interface IPagination {
  currentPage: number;
  onPrevClick: () => void;
  onNextClick: () => void;
  totalpages?: number;
}

const Pagination = ({
  currentPage,
  totalpages,
  onNextClick,
  onPrevClick,
}: IPagination) => {
  return (
    <div className="flex flex-row justify-center gap-2 mt-5">
      <button onClick={onPrevClick} className="hover:bg-gray-300 rounded-md">
        <MdNavigateBefore className="h-6 w-6" />
      </button>
      <p>
        {currentPage} de {totalpages ? totalpages : "..."}
      </p>
      <button onClick={onNextClick} className="hover:bg-gray-300 rounded-md">
        <MdNavigateNext className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Pagination;
