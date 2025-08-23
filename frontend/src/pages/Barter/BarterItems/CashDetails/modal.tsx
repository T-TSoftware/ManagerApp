import ModalWrapper from "../../../../components/layout/ModalWrapper";
import CashDetailsGrid from "./grid";

type Props = {
  open: boolean;
  onClose: () => void;
  barterItemId: string;
};

const CashDetailsModal = ({ open, onClose, barterItemId }: Props) => {
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div
        className="bg-white py-4 px-4 sm:px-6 md:px-7 rounded-xl shadow-xl
                w-[92vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[72vw]
                max-w-6xl
                max-h-[90vh] overflow-y-auto
                dark:bg-primary dark:text-white"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Nakit Anlaşma Detayları
        </h2>

        <CashDetailsGrid barterItemId={barterItemId} />
      </div>
    </ModalWrapper>
  );
};

export default CashDetailsModal;
