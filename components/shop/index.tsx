'use client'
import { useState, useMemo } from "react";
import { Box, Flex, Text, Portal, Select, createListCollection, Checkbox, Icon } from "@chakra-ui/react";
import { TbFilterCheck } from "react-icons/tb";
import Products from "./products";
import { ProductsDetails } from "../home/featured-products-section";

const frameworks = createListCollection({
  items: [
    { label: "Low to High", value: "low" },
    { label: "High to Low", value: "high" },
  ],
})

const initialValues = [
  { label: "Poultry", checked: false, value: "poultry" },
  { label: "Turkey", checked: false, value: "turkey" },
  { label: "Fish & Seafood", checked: false, value: "seafood" },
  { label: "Processed Meat", checked: false, value: "meat" },
  { label: "Poultry Parts", checked: false, value: "poultryparts" },
  { label: "Offals(Beef)", checked: false, value: "beef" },
]

export default function ShopPage() {
  const [values, setValues] = useState(initialValues)
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("")

  const extractPrice = (priceStr: string): number => {
    const match = priceStr.match(/\d+/)
    return match ? parseInt(match[0]) : 0
  }

  const filteredAndSortedProducts = useMemo(() => {
    const selectedCategories = values.filter(v => v.checked).map(v => v.value.toLowerCase())
    let filtered = ProductsDetails

    if (selectedCategories.length > 0) {
      const categoryMap: { [key: string]: string[] } = {
        'poultry': ['Poultry'],
        'turkey': ['Turkey'],
        'seafood': ['SeaFood'],
        'meat': ['Meat'],
        'poultryparts': ['Poultry Parts'],
        'beef': ['Beef']
      }

      const matchingCategories = selectedCategories.flatMap(cat => categoryMap[cat] || [])
      filtered = ProductsDetails.filter(product =>
        matchingCategories.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()))
      )
    }

    if (selectedPriceRange) {
      filtered = [...filtered].sort((a, b) => {
        const priceA = extractPrice(a.price)
        const priceB = extractPrice(b.price)
        return selectedPriceRange === "low" ? priceA - priceB : priceB - priceA
      })
    }

    return filtered
  }, [values, selectedPriceRange])

  const allChecked = values.every((value) => value.checked)
  const indeterminate = values.some((value) => value.checked) && !allChecked

  const items = values.map((item, index) => (
    <Checkbox.Root
      key={item.value}
      variant="subtle"
      size={['md', 'lg']}
      colorPalette="green"
      checked={item.checked}
      onCheckedChange={(e) => {
        setValues((current) => {
          const newValues = [...current]
          newValues[index] = { ...newValues[index], checked: !!e.checked }
          return newValues
        })
      }}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label fontSize={['sm', 'md']}>{item.label}</Checkbox.Label>
    </Checkbox.Root>
  ))

    return (
        <>
            <Box bg="white" h={20}></Box>
            <Box minH="100vh">
                <Flex 
                    justifyContent={['center', 'space-between']} p={[4, 5]} direction={['column', 'row']} 
                    alignItems="center" gap={[4, 0]}
                >
                    <Text color="gray.600" textAlign={['center', 'left']} fontSize={['sm', 'md']} maxW={['90%', '60%']}>
                        Browse our selection of fresh and affordable frozen foods
                    </Text>

                    <Box width={['90%', '320px']} mx={['auto', 0]}>
                        <Select.Root
                            collection={frameworks}
                            size="sm"
                            width="100%"
                            value={selectedPriceRange ? [selectedPriceRange] : []}
                            onValueChange={(e) => setSelectedPriceRange(e.value[0] || "")}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger><Select.ValueText placeholder="Select Price Range" /></Select.Trigger>
                                <Select.IndicatorGroup><Select.Indicator /></Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {frameworks.items.map((framework) => (
                                        <Select.Item item={framework} key={framework.value}>
                                            {framework.label}<Select.ItemIndicator />
                                        </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>
                </Flex>

                <Flex direction={['column', 'row']} mb={8} alignItems={['center', 'flex-start']}>
                    <Box
                        p={4}
                        w={['80%', '80%', '250px']}
                        bg={['gray.50', 'gray.50', 'transparent']}
                        borderRadius={['md', 'md', 'none']}
                        mb={[4, 4, 0]}
                        boxShadow={['sm', 'sm', 'none']}
                        mx={['auto', 'auto', 0]}
                    >
                        <Flex 
                            align="center" mb={[3, 4]} pb={2} 
                            borderBottom={['1px solid', '1px solid', 'none']} 
                            borderColor="gray.200"
                        >
                            <Icon as={TbFilterCheck} color="green.600" boxSize={[5, 6]} mr={2} />
                            <Text fontWeight="medium" fontSize={['md', 'lg']} color="gray.700">Category</Text>
                        </Flex>

                        <Checkbox.Root
                            mb={3}
                            checked={indeterminate ? "indeterminate" : allChecked}
                            onCheckedChange={(e) => {
                                setValues((current) => current.map((value) => ({ ...value, checked: !!e.checked })))
                            }}
                            variant="subtle"
                            size={['md', 'lg']}
                            colorPalette="green"
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                            <Checkbox.Label fontWeight="medium">All</Checkbox.Label>
                        </Checkbox.Root>

                        <Flex 
                            direction="column" gap={[2, 3]} maxH={['200px', '300px', 'none']} 
                            overflowY={['auto', 'auto', 'visible']}
                        >
                            {items}
                        </Flex>
                    </Box>
                    <Products filteredProducts={filteredAndSortedProducts} />
                </Flex>
            </Box>
        </>
    );
}