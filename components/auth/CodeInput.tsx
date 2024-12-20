import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function CodeInput({ length = 8 }: { length?: number }) {
  return (
    <InputOTP maxLength={8} name="code" id="code">
      <InputOTPGroup>
        {Array(length)
          .fill(null)
          .map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
