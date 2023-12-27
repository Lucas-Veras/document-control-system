import { FaFilePdf } from "react-icons/fa6";
import { FaFileSignature, FaFileWaveform } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IDocument } from "../../interfaces/IDocument";
import { formatText } from "../../utils/formatText";

type IDocumentCard = IDocument & {
  isLoading: boolean;
  isLoadingSignedPdf: boolean;
  handleDownloadPdf: (id: number, name: string) => void;
  handleDownloadSignedPdf: (id: number, name: string) => void;
};

const DocumentCard = ({
  name,
  description,
  handleDownloadPdf,
  handleDownloadSignedPdf,
  isLoading,
  isLoadingSignedPdf,
  id,
}: IDocumentCard) => {
  return (
    <div className="group w-full flex flex-row sm:flex-col justify-between gap-x-6 rounded-lg p-4 hover:bg-gray-200 bg-white mb-2 align-center">
      <div className="flex flex-row gap-4 justify-center sm:mb-3 sm:justify-start">
        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white self-center">
          <FaFilePdf
            className="h-6 w-6 text-gray-600 group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 break-all">
            {formatText(name, 50)}
          </p>
          <p className="mt-1 text-sm text-gray-600 break-all">
            {formatText(description)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mr-2 flex-row sm:flex-col">
        <button
          className="cursor-pointer flex justify-center flex-col sm:flex-row sm:w-full gap-1 items-center bg-gray-100 py-3 px-7 rounded-md group/button"
          onClick={() => handleDownloadPdf(id, name)}
        >
          {isLoading ? (
            <div className="animate-spin py-[4px]">
              <AiOutlineLoading3Quarters />
            </div>
          ) : (
            <>
              <FaFileWaveform className="h-4 w-4 text-gray-600 group-hover/button:text-primary" />
              <p className="text-[10px] font-semibold group-hover/button:text-primary">
                PDF
              </p>
            </>
          )}
        </button>
        <button
          className="cursor-pointer flex justify-center flex-col sm:flex-row sm:w-full gap-1 items-center bg-gray-100 p-3 rounded-md group/button"
          onClick={() => handleDownloadSignedPdf(id, name)}
        >
          {isLoadingSignedPdf ? (
            <div className="animate-spin py-[10px] px-[10px]">
              <AiOutlineLoading3Quarters />
            </div>
          ) : (
            <>
              <FaFileSignature className="h-4 w-4 text-gray-600 group-hover/button:text-primary" />
              <p className="text-[10px] font-semibold group-hover/button:text-primary whitespace-nowrap">
                PDF Assinado
              </p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
