import type { NavbarProps } from "../../types/internal";

const Navbar = ({ restaurant }: NavbarProps) => {
  const restaurantName = restaurant?.name ?? "Restaurant";
  const restaurantLocation = restaurant?.location ?? "";
  const restaurantLogo =
    restaurant?.logo ??
    "https://res.cloudinary.com/dixjcb4on/image/upload/v1741629142/dishes_image/hillPoint_logo.png";

  return (
    <nav className="bg-white w-full border-b border-gray-200">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <div className="h-14 w-14 rounded-full overflow-hidden bg-green-500 flex items-center justify-center">
            <img
              src={restaurantLogo}
              className="h-full w-full object-cover"
              alt={`${restaurantName} logo`}
            />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">{restaurantName}</p>
            <p className="text-xs text-gray-500">{restaurantLocation}</p>
          </div>
        </div>

        <div className="text-xs text-gray-400">by Zayka</div>
      </div>
    </nav>
  );
};

export default Navbar;
