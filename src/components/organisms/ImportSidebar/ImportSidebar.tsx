import { ImportList, mockImports } from "@molecules/index";

export default function ImportSidebar() {
  // This component is for fetch and state management

  return (
    <div>
      <ImportList items={mockImports} />
    </div>
  );
}
