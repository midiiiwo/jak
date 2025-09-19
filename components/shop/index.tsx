"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Portal,
  Select,
  createListCollection,
  Checkbox,
  Icon,
} from "@chakra-ui/react";
import { TbFilterCheck } from "react-icons/tb";
import Products from "./products";

const priceRangeOptions = createListCollection({
  items: [
    { label: "Low to High", value: "low" },
    { label: "High to Low", value: "high" },
  ],
});

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      if (checked) {
        return [...prev, categorySlug];
      } else {
        return prev.filter((cat) => cat !== categorySlug);
      }
    });
  };

  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map((cat) => cat.slug));
    } else {
      setSelectedCategories([]);
    }
  };

  const allChecked =
    selectedCategories.length === categories.length && categories.length > 0;
  const indeterminate =
    selectedCategories.length > 0 &&
    selectedCategories.length < categories.length;

  // Get the active category filter for the Products component
  const activeCategory =
    selectedCategories.length === 1
      ? selectedCategories[0]
      : selectedCategories.length === 0
      ? undefined
      : "multiple";

  return (
    <>
      <Box bg="white" h={20}></Box>
      <Box minH="100vh">
        <Flex
          justifyContent={["center", "space-between"]}
          p={[4, 5]}
          direction={["column", "row"]}
          alignItems="center"
          gap={[4, 0]}
        >
          <Text
            color="gray.600"
            textAlign={["center", "left"]}
            fontSize={["sm", "md"]}
            maxW={["90%", "60%"]}
          >
            Browse our selection of fresh and affordable frozen foods
          </Text>

          <Box width={["90%", "320px"]} mx={["auto", 0]}>
            <Select.Root
              collection={priceRangeOptions}
              size="sm"
              width="100%"
              value={selectedPriceRange ? [selectedPriceRange] : []}
              onValueChange={(e) => setSelectedPriceRange(e.value[0] || "")}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select Price Range" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {priceRangeOptions.items.map((option) => (
                      <Select.Item item={option} key={option.value}>
                        {option.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>
        </Flex>

        <Flex
          direction={["column", "row"]}
          mb={8}
          alignItems={["center", "flex-start"]}
        >
          <Box
            p={4}
            w={["80%", "80%", "250px"]}
            bg={["gray.50", "gray.50", "transparent"]}
            borderRadius={["md", "md", "none"]}
            mb={[4, 4, 0]}
            boxShadow={["sm", "sm", "none"]}
            mx={["auto", "auto", 0]}
          >
            <Flex
              align="center"
              mb={[3, 4]}
              pb={2}
              borderBottom={["1px solid", "1px solid", "none"]}
              borderColor="gray.200"
            >
              <Icon
                as={TbFilterCheck}
                color="green.600"
                boxSize={[5, 6]}
                mr={2}
              />
              <Text
                fontWeight="medium"
                fontSize={["md", "lg"]}
                color="gray.700"
              >
                Category
              </Text>
            </Flex>

            {!loading && categories.length > 0 && (
              <>
                <Checkbox.Root
                  mb={3}
                  checked={indeterminate ? "indeterminate" : allChecked}
                  onCheckedChange={(e) =>
                    handleSelectAllCategories(!!e.checked)
                  }
                  variant="subtle"
                  size={["md", "lg"]}
                  colorPalette="green"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label fontWeight="medium">All</Checkbox.Label>
                </Checkbox.Root>

                <Flex
                  direction="column"
                  gap={[2, 3]}
                  maxH={["200px", "300px", "none"]}
                  overflowY={["auto", "auto", "visible"]}
                >
                  {categories.map((category) => (
                    <Checkbox.Root
                      key={category.id}
                      variant="subtle"
                      size={["md", "lg"]}
                      colorPalette="green"
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={(e) =>
                        handleCategoryChange(category.slug, !!e.checked)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label fontSize={["sm", "md"]}>
                        {category.name}
                      </Checkbox.Label>
                    </Checkbox.Root>
                  ))}
                </Flex>
              </>
            )}

            {loading && (
              <Text fontSize="sm" color="gray.500">
                Loading categories...
              </Text>
            )}
          </Box>

          <Products
            category={
              activeCategory === "multiple" ? undefined : activeCategory
            }
            search={searchQuery}
          />
        </Flex>
      </Box>
    </>
  );
}
