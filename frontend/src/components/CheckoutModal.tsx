import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalPrice?: number;
  itemCount?: number;
  paymentOption?: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalPrice = 0,
  itemCount = 0,
  paymentOption = "Cash on Delivery",
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <CheckCircleOutlineIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Confirm Your Order
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Please review your order details before confirming:
        </Typography>

        {/* Order Summary */}
        <Box
          sx={{
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            p: 2.5,
            mb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <ShoppingCartIcon sx={{ color: "#dc2626" }} />
            <Typography variant="subtitle1" fontWeight="600">
              Order Summary
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography variant="body2" color="text.secondary">
              Total Items:
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body2" color="text.secondary">
              Payment Method:
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <PaymentIcon sx={{ fontSize: 16, color: "#dc2626" }} />
              <Typography variant="body2" fontWeight="600">
                {paymentOption}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="700">
              Total Amount:
            </Typography>
            <Typography variant="h5" fontWeight="700" sx={{ color: "#dc2626" }}>
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 2,
            p: 2,
            display: "flex",
            gap: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
            ℹ️
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your order will be processed immediately after confirmation. Please
            ensure all details are correct.
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            borderColor: "#e5e7eb",
            color: "#6b7280",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#d1d5db",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
              boxShadow: "0 6px 16px rgba(220,38,38,0.4)",
            },
          }}
        >
          Confirm Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutModal;
