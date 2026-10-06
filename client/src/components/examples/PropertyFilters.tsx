import PropertyFilters from "../PropertyFilters";

export default function PropertyFiltersExample() {
  return (
    <div className="p-8">
      <PropertyFilters onFilter={(filters) => console.log("Filters:", filters)} />
    </div>
  );
}
