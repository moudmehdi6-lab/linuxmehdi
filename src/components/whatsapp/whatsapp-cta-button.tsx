import { Button, type ButtonProps } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp/whatsapp-icon";
import { cn } from "@/lib/utils";

type WhatsAppCTAButtonProps = ButtonProps & {
  href: string;
  label: string;
};

export function WhatsAppCTAButton({
  href,
  label,
  className,
  size,
  ...props
}: WhatsAppCTAButtonProps) {
  return (
    <Button
      asChild
      variant="whatsapp"
      size={size}
      className={cn(className)}
      {...props}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        {label}
      </a>
    </Button>
  );
}
