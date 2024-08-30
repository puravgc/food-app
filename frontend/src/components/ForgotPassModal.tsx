import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import OtpInput from "react-otp-input";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

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
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsOtpSent(true);
        toast.success("OTP sent to your email.");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("An error occurred while requesting OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/verifyotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success === true) {
        setLoading(false);
        toast.success("OTP verified");
        const encryptedEmail = CryptoJS.AES.encrypt(
          email,
          "testsecret"
        ).toString();
        const encodedEmail = encodeURIComponent(encryptedEmail);
        navigate(`/newpassword/${encodedEmail}`);
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to verify OTP.");
      console.log(error);
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
            {isOtpSent
              ? "Please enter the OTP sent to your email."
              : "Please enter your email to reset your password."}
          </Typography>
          <form onSubmit={isOtpSent ? handleOtpSubmit : handleResetSubmit}>
            {!isOtpSent ? (
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                color="error"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: "100%",
                  height: "3rem",
                  margin: "0 0.5rem",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  transition: "border-color 0.3s ease",
                }}
              />
            )}
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
                ) : isOtpSent ? (
                  "Verify OTP"
                ) : (
                  "Send OTP"
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
