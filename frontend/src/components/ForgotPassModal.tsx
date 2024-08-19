import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface ForgotPasswordModalProps {
  open: boolean;
  handleClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  handleClose,
}) => {
  const [email, setemail] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);

    try {
      const response = await fetch("http://localhost:5000/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success === true) {
        toast.success("OTP sent to your email.");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("An error occurred while requesting OTP.");
    } finally {
      setloading(false);
    }
  };

  return (
    <Modal
      aria-labelledby="forgot-password-modal-title"
      aria-describedby="forgot-password-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography
            id="forgot-password-modal-title"
            variant="h6"
            component="h2"
          >
            Forgot Password
          </Typography>
          <Typography id="forgot-password-modal-description" sx={{ mt: 2 }}>
            Please enter your email to reset your password.
          </Typography>
          <form onSubmit={handleResetSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              color="error"
              required
              type="email"
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={handleClose} variant="outlined" color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="error">
                {loading ? (
                  <>
                    <div role="status">
                      <AiOutlineLoading className="animate-spin h-5 w-5" />
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ForgotPasswordModal;
