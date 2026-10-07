const MENU_DATA =  
{
    breakfast: [
      { id: 'b1', name: 'Katogo', price: 7000, badge: 'Local Favorite', desc: 'Traditional Ugandan matooke katogo with savory sauce.', img: 'cafe images/katogo.jpg' },
      { id: 'b2', name: 'English Breakfast', price: 25000, badge: 'Chef Favorite', desc: 'A hearty platter of fried eggs, sausages, baked beans, toast, and grilled tomatoes.', img: 'cafe images/englishbf.jpg' },
      { id: 'b3', name: 'Rolex (Vegetable)', price: 5000, badge: '', desc: 'Freshly pan-fried chapati rolled with a spiced vegetable.', img: 'cafe images/rolexveg.jpg' },
      { id: 'b4', name: 'Rolex (Beef)', price: 8000, badge: 'Popular', desc: 'Warm chapati wrapped around a seasoned egg and tender minced beef.', img: 'cafe images/rolex-beef.jpg' },
      { id: 'b5', name: 'Rolex (Chicken)', price: 10000, badge: 'Popular', desc: 'Warm chapati packed with an egg and shredded chicken.', img: 'cafe images/rolex-chicken.jpg' },
      { id: 'b6', name: 'Chicken Roll', price: 15000, badge: '', desc: 'Golden flatbread stuffed with spiced chicken breast strips.', img: 'cafe images/chickenroll.jpg' },
      { id: 'b7', name: 'Beef Roll', price: 15000, badge: '', desc: 'Golden roll loaded minced beef, eggs and vegetables.', img: 'cafe images/beefroll.jpg' },
      { id: 'b8', name: 'Sandwich', price: 25000, badge: 'Trending', desc: 'Toasted double-decker bread stacked with fresh veggies and cheese.', img: 'cafe images/sandwich.jpg' },
      { id: 'b9', name: 'Sausages (Pair)', price: 4000, badge: '', desc: 'Two juicy, grilled beef sausages served hot.', img: 'cafe images/sausage.jpg' },
      { id: 'b10', name: 'Samosas (Pair)', price: 3000, badge: 'Student favorite', desc: 'Triangular sumbusas filled with beef/kawo with spices.', img: 'cafe images/samosa.jpg' },
      { id: 'b11', name: 'Chapati', price: 2000, badge: 'Student favorite', desc: 'Soft, hand-spun Ugandan chapati grilled to golden perfection.', img: 'cafe images/chapati.jpg' }
    ],
    lunch: [
      { id: 'l1', name: 'Lusaniya (Medium)', price: 52000, badge: "Chef's Pick", desc: 'Local medium Lusaniya with all food choices.', img: 'cafe images/lusaniyamedium.jpg' },
      { id: 'l2', name: 'Lusaniya (Large)', price: 75000, badge: 'Group Special', desc: 'Extra-vagant large Lusaniya with all food choices, for sharing with group.', img: 'cafe images/lusaniyalarge.jpg' },
      { id: 'l3', name: 'Whole Chicken', price: 80000, badge: 'Special', desc: 'Full oven-roasted chicken with spices and sauces.', img: 'cafe images/chickenwhole.jpg' },
      { id: 'l4', name: 'Chips & Liver', price: 22000, badge: '', desc: 'Golden french fries paired with spiced beef liver.', img: 'cafe images/chipsliver.jpg' },
      { id: 'l5', name: 'Chips & Chicken', price: 22000, badge: 'Best Seller', desc: 'Crispy french fries served alongside fried chicken.', img: 'cafe images/chips-chicken.jpg' },
      { id: 'l6', name: "Chips & Goat's Meat", price: 22000, badge: '', desc: 'Crispy french fries served with stewed, tender goat meat.', img: 'cafe images/chipsgoat.jpg' },
      { id: 'l7', name: 'Plain Chips', price: 7000, badge: '', desc: 'Freshly cut, fried potato fries lightly seasoned with salt.', img: 'cafe images/chipsplain.jpg' },
      { id: 'l8', name: 'Pilau', price: 15000, badge: 'Popular', desc: 'Pilau rice cooked in rich spiced beef and aromatic spices.', img: 'cafe images/pilau.jpg' }
    ],
    mains: [
      { id: 'm1', name: 'Chicken Wings', price: 25000, badge: 'Popular', desc: 'Crispy chicken wings tossed in your choice of sweet chilli or barbecue sauce.', img: 'cafe images/chickenwings.jpg' },
      { id: 'm2', name: 'Special Burger', price: 17000, badge: "Chef's Pick", desc: 'Juicy beef layered with cheese, fried egg, lettuce and special Alma sauce.', img: 'cafe images/burgerspecial.jpg' },
      { id: 'm3', name: 'Plain Burger', price: 11000, badge: '', desc: 'Grilled beef patty served in a toasted bun.', img: 'cafe images/burgerplain.jpg' },
      { id: 'm4', name: 'Chicken Biryani', price: 25000, badge: 'Indian Special', desc: 'Basmatti rice  with whole spices and tender chicken.', img: 'cafe images/chickenbiryani.jpg' },
      { id: 'm5', name: 'Chicken Curry', price: 25000, badge: '', desc: 'Chicken stew cooked in a thick, aromatic coconut and spices.', img: 'cafe images/chickencurry.jpg' },
      { id: 'm6', name: 'Chicken Tikka', price: 25000, badge: 'Hot & Spicy', desc: 'Boneless chicken pieces marinated in and favorite spices, served hot.', img: 'cafe images/chickentikka.jpg' },
      { id: 'm7', name: 'Chicken Masala (Half)', price: 35000, badge: '', desc: 'Half chicken in rich, spiced tomato and onion masala sauce.', img: 'cafe images/masalahalf.jpg' },
      { id: 'm8', name: 'Chicken Masala (Whole)', price: 70000, badge: 'Special', desc: 'Whole chicken simmered in rich, spiced tomato and onion masala sauce.', img: 'cafe images/chickenwhole.jpg' }
    ],
    pizza: [
      { id: 'p1', name: 'Vegetable Pizza (Medium)', price: 25000, badge: '', desc: 'Fresh peppers, onions, sweetcorn, and olives over melted mozzarella.', img: 'cafe images/pizzaveg.jpg' },
      { id: 'p2', name: 'Vegetable Pizza (Large)', price: 35000, badge: 'On-demand', desc: 'Large topped with peppers, sweetcorn, onions, and extra cheese.', img: 'cafe images/pizzaveg.jpg' },
      { id: 'p3', name: 'Beef Pizza (Medium)', price: 25000, badge: '', desc: 'Seasoned minced beef, red onions, and rich marinara sauce under mozzarella.', img: 'cafe images/pizzabeef.jpg' },
      { id: 'p4', name: 'Beef Pizza (Large)', price: 35000, badge: 'Popular', desc: 'Large hand-tossed pizza loaded with spiced minced beef and melted cheese.', img: 'cafe images/pizzabeef.jpg' },
      { id: 'p5', name: 'Chicken Pizza (Medium)', price: 25000, badge: '', desc: 'Tender grilled chicken chunks, sweet bell peppers, and melted cheese.', img: 'cafe images/pizzachicken.jpg' },
      { id: 'p6', name: 'Chicken Pizza (Large)', price: 35000, badge: 'Best Seller', desc: 'Large pizza topped with juicy grilled chicken, sweetcorn, and mozzarella.', img: 'cafe images/pizzachicken.jpg' },
      { id: 'p7', name: 'Alma 4 Season Pizza (Large)', price: 40000, badge: 'Alma Special', desc: 'House special combination of chicken, beef, fresh veggies, and triple cheese.', img: 'cafe images/pizza4season.jpg' }
    ],
    coffee: [
      { id: 'c1', name: 'Cappuccino', price: 10000, badge: 'Best Seller', desc: 'Rich espresso topped with equal parts steamed milk and silky velvety foam.', img: 'cafe images/latte.jpg' },
      { id: 'c2', name: 'Espresso (Single)', price: 5000, badge: '', desc: 'A concentrated shot of roasted Arabica coffee with dark crema.', img: 'cafe images/espressosingle.jpg' },
      { id: 'c3', name: 'Espresso (Double)', price: 8000, badge: '', desc: 'A double shot of intense, full-bodied espresso for a quick boost.', img: 'cafe images/espressodouble.jpg' },
      { id: 'c4', name: 'Americano (Single)', price: 8000, badge: '', desc: 'Single espresso diluted with hot water for a smooth, bold coffee flavor.', img: 'cafe images/americano.jpg' },
      { id: 'c5', name: 'Americano (Double)', price: 10000, badge: 'Popular', desc: 'Double shot espresso elongated with hot water for extra depth.', img: 'cafe images/americano.jpg' },
      { id: 'c6', name: 'Latte', price: 10000, badge: 'Popular', desc: 'Smooth espresso combined with generous steamed milk and thin light foam.', img: 'cafe images/latte.jpg' },
      { id: 'c7', name: 'Mocha', price: 10000, badge: '', desc: 'Rich espresso blended with dark cocoa syrup and warm steamed milk.', img: 'cafe images/mocha.jpg' },
      { id: 'c8', name: 'Black Coffee', price: 8000, badge: '', desc: 'Pure brewed Ugandan coffee served dark without milk.', img: 'cafe images/blackcoffee.jpg' },
      { id: 'c9', name: 'African Coffee', price: 6000, badge: '', desc: 'Traditional spiced coffee brewed with local fresh ginger and cinnamon.', img: 'cafe images/blackcoffee.jpg' },
      { id: 'c10', name: 'Caramel Macchiato', price: 10000, badge: "Chef's Pick", desc: 'Freshly steamed milk with vanilla-flavored syrup, espresso, and caramel drizzle.', img: 'cafe images/macchiato.jpg' },
      { id: 'c11', name: 'Hot Chocolate', price: 8000, badge: '', desc: 'Creamy melted cocoa combined with hot milk for a comforting beverage.', img: 'cafe images/hotchocolate.jpg' },
      { id: 'c12', name: 'Black Tea', price: 3000, badge: '', desc: 'Steeped black tea leaves served piping hot with sugar options.', img: 'cafe images/blacktea.jpg' },
      { id: 'c13', name: 'Dawa Tea', price: 7000, badge: 'Health Special', desc: 'Soothing wellness tea infused with fresh lemon, ginger, garlic, and pure honey.', img: 'cafe images/dawatea.jpg' },
      { id: 'c14', name: 'African Tea', price: 5000, badge: 'Popular', desc: 'Ugandan milk tea boiled with fresh ginger and local spices.', img: 'cafe images/americano.jpg' },
      { id: 'c15', name: 'Green Tea', price: 7000, badge: '', desc: 'Lightly roasted green tea leaves rich in antioxidants and herbal flavor.', img: 'cafe images/greentea.jpg' },
      { id: 'c16', name: 'Lemon Tea', price: 5000, badge: '', desc: 'Classic brewed black tea infused with real squeezed fresh lemon juice.', img: 'cafe images/dawatea.jpg' }
    ],
    soft_drinks: [
      { id: 'sd1', name: 'Fresh Juice', price: 5000, badge: 'Fresh Daily', desc: 'Pure squeezed fruit juice available in passion fruit, mango, or pineapple.', img: 'cafe images/juice.jpg' },
      { id: 'sd2', name: 'Milkshake', price: 15000, badge: 'Popular', desc: 'Thick ice cream shake blended in vanilla, chocolate, or strawberry flavors.', img: 'cafe images/milkshake.jpg' },
      { id: 'sd3', name: 'Smoothie', price: 10000, badge: '', desc: 'Blended fresh tropical fruits with chilled yogurt and honey.', img: 'cafe images/smoothie.jpg' },
      { id: 'sd4', name: 'Soda', price: 2000, badge: '', desc: 'Chilled 300ml glass bottle soda (Coca-Cola, Fanta, Novida) include in special instructions.', img: 'cafe images/soda.jpg' },
      { id: 'sd5', name: 'Mineral Water', price: 2000, badge: '', desc: '500ml pure cold bottled drinking water.', img: 'cafe images/water.jpg' },
      { id: 'sd6', name: 'Plain Milk (Extra)', price: 5000, badge: '', desc: 'Steamed or chilled whole fresh dairy milk.', img: 'cafe images/milk.jpg' },
    ],
    add_ons: [
      { id: 'sd7', name: 'Ginger Add-on', price: 1000, badge: '', desc: 'Fresh crushed ginger shot to add extra spice to your tea or coffee.', img: 'cafe images/ginger.jpg' },
      { id: 'sd8', name: 'Honey Add-on', price: 1000, badge: '', desc: 'Pure organic natural honey portion for sweetening drinks.', img: 'cafe images/honey.jpg' }
    ]
};

if (typeof module !== 'undefined') module.exports = MENU_DATA;