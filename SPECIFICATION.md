https://datatracker.ietf.org/doc/html/rfc8259#section-1

## Values

### Four primitive types:

- Strings (zero or more Unicode characters)
- Numbers
- Booleans
- Null

### Two structured types:

- Arrays (zero or mode values)
- Objects

## Grammar

Six structural characters:

    begin-array     - [

    begin-object    - {

    end-array       - ]

    end-object      - }

    name-separator  - :

    value-separator - ,

Insignificant whitespace allowed before or after structural characters

    %x20 - Space
    %x09 - Horizontal tab
    %x0A - Line feed or New line
    %x0D - Carriage return

## Objects

### Unique keys

Allow duplicate keys, ensuring the order is dictated by their first occurrence in the object.
The value of the last occurence is final.

## Numbers

1. Optional minus sign
2. Integer component
3. Fraction part
4. Exponent part - e/E-/+