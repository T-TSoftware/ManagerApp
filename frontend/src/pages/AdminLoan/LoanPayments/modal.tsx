import CashDetailsGrid from "./grid";
import ModalWrapper from "../../../components/layout/ModalWrapper";

type Props = {
  open: boolean;
  onClose: () => void;
  loanId: string;
};

const LoanInstallmentModal = ({ open, onClose, loanId }: Props) => {
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-5xl dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Kredi Ödeme Detayları
        </h2>
        <CashDetailsGrid loanId={loanId} />
      </div>
    </ModalWrapper>
  );
};

export default LoanInstallmentModal;
