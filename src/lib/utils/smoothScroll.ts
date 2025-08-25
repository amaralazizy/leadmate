/**
 * Smoothly scrolls to a specific element by ID
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset from the top (default: 0)
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
}


/**
 * Smoothly scrolls to the top of the page
 */
export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
