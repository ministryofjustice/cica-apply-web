import {createPolyfills} from '.';

describe('polyfills', () => {
    const polyfills = createPolyfills();
    document.body.innerHTML = `
        <span id="my-span" class="some-class class-foo">This is my span element</span>
    `;
    const mySpanElement = document.getElementById('my-span');

    describe('forEach', () => {
        it('should iterate an array using forEach', () => {
            const myArray = [1, 2, 3, 4, 5, 6];
            polyfills.forEach(myArray, (element, index) => {
                myArray[index] = element * 3;
            });
            expect(myArray).toEqual([3, 6, 9, 12, 15, 18]);
        });
    });

    describe('Add event listener', () => {
        const myEventHandler = () => {
            mySpanElement.classList.add('class-bar');
        };
        it('should add an event listener to an element', () => {
            polyfills.addEventListener(mySpanElement, 'click', myEventHandler);
            mySpanElement.click();
            expect(mySpanElement.className).toEqual(expect.stringContaining('class-bar'));
        });
    });

    describe('has class', () => {
        it('should determine if it has a class', () => {
            expect(polyfills.hasClass(mySpanElement, 'class-bar')).toEqual(true);
        });
        it('should determine if it does not have a class', () => {
            expect(polyfills.hasClass(mySpanElement, 'class-baz')).toEqual(false);
        });
    });
});
