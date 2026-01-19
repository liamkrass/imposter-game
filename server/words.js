const wordList = [
    {
        category: 'Animals',
        words: [
            'Lion', 'Elephant', 'Giraffe', 'Penguin', 'Shark', 'Eagle', 'Dolphin',
            'Tiger', 'Bear', 'Wolf', 'Kangaroo', 'Panda', 'Zebra', 'Gorilla',
            'Octopus', 'Crocodile', 'Owl', 'Flamingo', 'Camel', 'Cheetah',
            'Hippopotamus', 'Rhino', 'Koala', 'Platypus', 'Sloth', 'Ant', 'Bat',
            'Bee', 'Bird', 'Butterfly', 'Cat', 'Chicken', 'Cow', 'Crab', 'Deer',
            'Dog', 'Duck', 'Fish', 'Fox', 'Frog', 'Goat', 'Goose', 'Hen', 'Horse',
            'Insect', 'Kitten', 'Lizard', 'Monkey', 'Mouse', 'Pig', 'Puppy',
            'Rabbit', 'Rat', 'Sheep', 'Snake', 'Spider', 'Squirrel', 'Swan',
            'Turkey', 'Turtle', 'Whale', 'Worm', 'Dinosaur', 'Dragon', 'Unicorn',
            'Beaver', 'Buffalo', 'Chameleon', 'Chipmunk', 'Cobra', 'Crab', 'Crow',
            'Donkey', 'Eel', 'Elk', 'Ferret', 'Gazelle', 'Gecko', 'Gopher',
            'Hamster', 'Hawk', 'Hedgehog', 'Hyena', 'Iguana', 'Jaguar', 'Jellyfish',
            'Lemur', 'Leopard', 'Llama', 'Lobster', 'Meerkat', 'Mole', 'Moose',
            'Mosquito', 'Moth', 'Mule', 'Newt', 'Ostrich', 'Otter', 'Panther',
            'Parrot', 'Peacock', 'Pelican', 'Pigeon', 'Piranha', 'Porcupine',
            'Pug', 'Puma', 'Python', 'Raccoon', 'Raven', 'Reindeer', 'Salamander',
            'Salmon', 'Scorpion', 'Seagull', 'Seahorse', 'Seal', 'Shark', 'Sheep',
            'Shrimp', 'Skunk', 'Snail', 'Sparrow', 'Squid', 'Starfish', 'Stork',
            'Swallow', 'Swordfish', 'Tapir', 'Tarantula', 'Termite', 'Toad',
            'Tortoise', 'Toucan', 'Tuna', 'Vulture', 'Walrus', 'Wasp', 'Weasel',
            'Woodpecker', 'Wombat', 'Yak'
        ]
    },
    {
        category: 'Food',
        words: [
            'Pizza', 'Sushi', 'Burger', 'Tacos', 'Pasta', 'Ice Cream', 'Salad',
            'Steak', 'Pancake', 'Donut', 'Ramen', 'Curry', 'Sandwich', 'Chocolate',
            'Popcorn', 'Cookie', 'Bagel', 'Cheese', 'Croissant', 'Dumpling',
            'Lasagna', 'Burrito', 'Waffles', 'Hot Dog', 'Fries', 'Apple', 'Banana',
            'Bread', 'Butter', 'Cake', 'Candy', 'Carrot', 'Cherry', 'Corn', 'Egg',
            'Fruit', 'Grape', 'Ham', 'Honey', 'Jam', 'Juice', 'Lemon', 'Lime',
            'Lunch', 'Meat', 'Milk', 'Nut', 'Onion', 'Orange', 'Peach', 'Peanut',
            'Pear', 'Pepper', 'Pie', 'Potato', 'Pumpkin', 'Rice', 'Salt', 'Sauce',
            'Sausage', 'Soup', 'Strawberry', 'Sugar', 'Tea', 'Toast', 'Tomato',
            'Vegetable', 'Water', 'Yogurt', 'Almond', 'Asparagus', 'Avocado', 'Bacon',
            'Basil', 'Bean', 'Beef', 'Berry', 'Biscuit', 'Blackberry', 'Blueberry',
            'Broccoli', 'Brownie', 'Cabbage', 'Cactus', 'Cake', 'Calamari', 'Candy',
            'Cantaloupe', 'Caramel', 'Cashew', 'Cauliflower', 'Celery', 'Cereal',
            'Cheddar', 'Cheese', 'Cheesecake', 'Cherry', 'Chili', 'Chips', 'Chocolate',
            'Chowder', 'Cinnamon', 'Clam', 'Cocoa', 'Coconut', 'Coffee', 'Cola',
            'Cookie', 'Corn', 'Crab', 'Cracker', 'Cranberry', 'Cream', 'Cucumber',
            'Cupcake', 'Curry', 'Custard', 'Date', 'Dessert', 'Dill', 'Dinner',
            'Dip', 'Dough', 'Doughnut', 'Drink', 'Duck', 'Dumpling', 'Eggplant',
            'Espresso', 'Feast', 'Fig', 'Fish', 'Flour', 'Fondue', 'Food', 'Fork',
            'Fudge', 'Garlic', 'Ginger', 'Grain', 'Granola', 'Grape', 'Grapefruit',
            'Gravy', 'Guacamole', 'Gum', 'Hamburger', 'Hazelnut', 'Herb', 'Honey',
            'Horseradish', 'Hummus', 'Ice', 'Icing', 'Jalapeno', 'Jelly', 'Jerky',
            'Juice', 'Kale', 'Ketchup', 'Kiwi', 'Lamb', 'Lasagna', 'Lemon',
            'Lemonade', 'Lentil', 'Lettuce', 'Licorice', 'Lime', 'Lobster',
            'Lollipop', 'Macaroni', 'Mango', 'Maple', 'Marshmallow', 'Mayonnaise',
            'Meatball', 'Melon', 'Meringue', 'Milk', 'Milkshake', 'Mint', 'Mocha',
            'Molasses', 'Muffin', 'Mushroom', 'Mustard', 'Nachos'
        ]
    },
    {
        category: 'Jobs',
        words: [
            'Doctor', 'Teacher', 'Pilot', 'Artist', 'Chef', 'Firefighter', 'Programmer',
            'Astronaut', 'Detective', 'Farmer', 'Lawyer', 'Scientist', 'Musician', 'Athlete',
            'Plumber', 'Architect', 'Photographer', 'Dentist', 'Writer', 'Soldier',
            'Nurse', 'Engineer', 'Actor', 'Judge', 'Mechanic', 'Baker', 'Barber',
            'Butcher', 'Carpenter', 'Cashier', 'Cleaner', 'Clown', 'Dancer', 'Driver',
            'Electrician', 'Fisherman', 'Gardener', 'Guard', 'Hairdresser', 'Hunter',
            'Journalist', 'Librarian', 'Lifeguard', 'Magician', 'Maid', 'Manager',
            'Miner', 'Model', 'Painter', 'Pharmacist', 'Pirate', 'Police', 'Politician',
            'Postman', 'Priest', 'Reporter', 'Sailor', 'Secretary', 'Singer', 'Spy',
            'Surgeon', 'Tailor', 'Waiter', 'Welder', 'Accountant', 'Actor', 'Actuary',
            'Agent', 'Air Traffic Controller', 'Ambassador', 'Analyst', 'Animator',
            'Anthropologist', 'Archaeologist', 'Architect', 'Artist', 'Assistant',
            'Astronaut', 'Astronomer', 'Athlete', 'Attorney', 'Author', 'Baker',
            'Banker', 'Barber', 'Barista', 'Bartender', 'Biologist', 'Blacksmith',
            'Bookkeeper', 'Botanist', 'Bricklayer', 'Broker', 'Builder', 'Butcher',
            'Butler', 'Cameraman', 'Captain', 'Cardiologist', 'Carpenter', 'Cartographer',
            'Cartoonist', 'Cashier', 'Chauffeur', 'Chef', 'Chemist', 'Clerk',
            'Coach', 'Cobbler', 'Coder', 'Comedian', 'Composer', 'Concierge',
            'Conductor', 'Consultant', 'Contractor', 'Cook', 'Cop', 'Counselor',
            'Courier', 'Curator', 'Dancer', 'Dentist', 'Designer', 'Detective',
            'Developer', 'Dietitian', 'Director', 'Diver', 'DJ', 'Doctor', 'Driver',
            'Drummer', 'Economist', 'Editor', 'Electrician', 'Engineer', 'Entertainer',
            'Entomologist', 'Entrepreneur', 'Executive', 'Explorer', 'Exporter',
            'Farmer', 'Firefighter', 'Fisherman', 'Florist', 'Foreman', 'Forester',
            'Geologist', 'Glassblower', 'Glazier', 'Golfer', 'Governor', 'Grocer',
            'Guard', 'Guide', 'Gymnast', 'Hairdresser', 'Handyman', 'Historian'
        ]
    },
    {
        category: 'Objects',
        words: [
            'Chair', 'Laptop', 'Bicycle', 'Camera', 'Guitar', 'Clock', 'Umbrella',
            'Backpack', 'Telescope', 'Mirror', 'Hammer', 'Pillow', 'Sunglasses', 'Wallet',
            'Key', 'Candle', 'Book', 'Shoe', 'Toothbrush', 'Headphones',
            'Phone', 'Lamp', 'Scissors', 'Cup', 'Watch', 'Ball', 'Balloon', 'Basket',
            'Bed', 'Bell', 'Belt', 'Blanket', 'Boat', 'Bottle', 'Box', 'Bowl',
            'Broom', 'Brush', 'Bucket', 'Button', 'Calculator', 'Car', 'Card',
            'Carpet', 'Comb', 'Computer', 'Doll', 'Door', 'Dress', 'Drum', 'Fan',
            'Flag', 'Fork', 'Glass', 'Glove', 'Hat', 'Helmet', 'Knife', 'Lock',
            'Map', 'Mask', 'Money', 'Mug', 'Needle', 'Pan', 'Pen', 'Pencil', 'Plate',
            'Pot', 'Radio', 'Ring', 'Rope', 'Shirt', 'Soap', 'Sock', 'Spoon', 'Stamp',
            'Table', 'Ticket', 'Toy', 'Vase', 'Window', 'Airplane', 'Alarm', 'Album',
            'Anchor', 'Anvil', 'Apron', 'Aquarium', 'Arrow', 'Atom', 'Axe', 'Badge',
            'Bag', 'Baggage', 'Bait', 'Bandage', 'Banner', 'Barrel', 'Battery',
            'Bead', 'Beaker', 'Bench', 'Beret', 'Bible', 'Binoculars', 'Biscuit',
            'Blade', 'Blender', 'Block', 'Blouse', 'Board', 'Bomb', 'Bone', 'Book',
            'Boot', 'Bow', 'Bowl', 'Bracelet', 'Brick', 'Bridge', 'Briefcase',
            'Broom', 'Brush', 'Bubble', 'Bucket', 'Bugle', 'Bulb', 'Bullet', 'Bus',
            'Button', 'Cabinet', 'Cable', 'Cage', 'Calculator', 'Calendar', 'Camera',
            'Can', 'Cannon', 'Canoe', 'Canvas', 'Cap', 'Cape', 'Car', 'Card',
            'Carpet', 'Cart', 'Case', 'Cash', 'Cassette', 'Catapult', 'Chain',
            'Chalk', 'Chandelier', 'Chart', 'Check', 'Chess', 'Chisel', 'Cigar',
            'Cigarette', 'Circle', 'Clamp', 'Clip', 'Clock', 'Cloth', 'Cloud',
            'Coat', 'Coil', 'Coin', 'Collar', 'Comb', 'Compass', 'Computer', 'Cone',
            'Container', 'Cord', 'Cork', 'Cot', 'Couch', 'Counter', 'Cover', 'Cradle'
        ]
    },
    {
        category: 'Places',
        words: [
            'Beach', 'School', 'Hospital', 'Library', 'Airport', 'Restaurant', 'Park',
            'Cinema', 'Gym', 'Museum', 'Zoo', 'Stadium', 'Supermarket', 'Bank',
            'Hotel', 'Farm', 'Police Station', 'Space Station', 'Castle', 'Forest',
            'Apartment', 'Bakery', 'Bar', 'Barn', 'Bridge', 'Cafe', 'Camp', 'Church',
            'City', 'Classroom', 'Club', 'College', 'Country', 'Court', 'Desert',
            'Factory', 'Field', 'Garage', 'Garden', 'Harbor', 'Hill', 'Home', 'House',
            'Island', 'Jail', 'Kitchen', 'Lake', 'Market', 'Mountain', 'Office',
            'Palace', 'Pool', 'Prison', 'River', 'Road', 'Room', 'Sea', 'Shop',
            'Station', 'Store', 'Street', 'Studio', 'Temple', 'Theater', 'Tower',
            'Town', 'University', 'Valley', 'Village', 'Arena', 'Attic', 'Auditorium',
            'Avenue', 'Backyard', 'Balcony', 'Bank', 'Barber', 'Barracks', 'Basement',
            'Bathroom', 'Bay', 'Bazaar', 'Bedroom', 'Boardwalk', 'Boat', 'Bookstore',
            'Boulevard', 'Boundary', 'Bowling Alley', 'Bridge', 'Building', 'Bungalow',
            'Bunker', 'Bus Stop', 'Butcher', 'Cabin', 'Cafe', 'Cafeteria', 'Cage',
            'Camp', 'Campfire', 'Campus', 'Canal', 'Canyon', 'Cape', 'Capital',
            'Carnival', 'Casino', 'Castle', 'Cathedral', 'Cave', 'Cellar', 'Cemetery',
            'Center', 'Chapel', 'Church', 'Cinema', 'Circus', 'City', 'Cliff',
            'Clinic', 'Club', 'Coast', 'College', 'Colony', 'Community', 'Compass',
            'Concert', 'Condo', 'Corner', 'Cottage', 'Counter', 'Country', 'County',
            'Court', 'Courtyard', 'Crater', 'Creek', 'Crossing', 'Crossroad', 'Cruise',
            'Dainty', 'Dairy', 'Dam', 'Deck', 'Dell', 'Delta', 'Department', 'Desert',
            'Desk', 'Dining Room', 'Disco', 'District', 'Ditch', 'Dock', 'Dorm',
            'Driveway', 'Dungeon', 'Earth', 'East', 'Elevator', 'Embassy', 'Empire',
            'Entrance', 'Estate', 'Exit', 'Factory', 'Fair', 'Farm', 'Fence',
            'Field', 'Fire Station', 'Flat', 'Floor', 'Florist', 'Forest', 'Fort'
        ]
    }
];


function getRandomWord(usedWords = []) {
    // 1. Flatten all words to check total availability vs used
    // This is a bit inefficient if called often but fine for this scale.
    // Better: Pick category, then pick word, retry if used.

    // Let's try to pick a random category first, then a random word from it.
    // If that word is used, try again.
    // To avoid infinite loops, we should filter available words first.

    let availableWords = [];

    wordList.forEach(cat => {
        cat.words.forEach(w => {
            if (!usedWords.includes(w)) {
                availableWords.push({ word: w, category: cat.category });
            }
        });
    });

    if (availableWords.length === 0) {
        // All words used! Reset logic handled by caller or just return a random one
        // For now, let's just return a random one (soft fail) or we could return null.
        // The user request "cant appear twice" implies hard constraint. 
        // If we strictly cannot appear twice, and we ran out, we MUST reset or notify.
        // Let's assume we reset the session's used words in the caller if we get a special return,
        // OR we just pick from the full list again (effectively resetting internal availability).

        // Let's just pick from full list if empty, effectively auto-resetting when exhausted.
        const categoryObj = wordList[Math.floor(Math.random() * wordList.length)];
        const word = categoryObj.words[Math.floor(Math.random() * categoryObj.words.length)];
        return { word, category: categoryObj.category, reset: true };
    }

    const selection = availableWords[Math.floor(Math.random() * availableWords.length)];
    return selection;
}

module.exports = { getRandomWord, wordList };
