export interface TabItemProps {
  active?: boolean;
  children: any;
  text: string;
  id: string;
  onClick?(id: string): void;
}