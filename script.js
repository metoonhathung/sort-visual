function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

//Fisher-Yates shuffle
function shuffling(arr) {
    let n = arr.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        swap(arr, i, j);
    }
}

//Bubble Sort
async function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        // let swapped = false;
        for (j = 0; j < n - i - 1; j++) {
            coloring(j + 1, "access");
            coloring(j, "current");
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
                // swapped = true;
            }
            await sleep(delay);
            coloring(j, "off");
            coloring(j + 1, "off");
        }
        coloring(n - 1 - i, "sort");
        // if (swapped == false) { break; }
    }
    coloring(0, "sort");
}

//Selection Sort
async function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        coloring(minIndex, "current");
        for (let j = i + 1; j < n; j++) {
            coloring(j, "access");
            await sleep(delay);
            coloring(j, "off");
            if (arr[j] < arr[minIndex]) {
                coloring(minIndex, "off");
                minIndex = j;
                coloring(minIndex, "current");
            }
        }
        swap(arr, minIndex, i);
        coloring(minIndex, "off");
        coloring(i, "sort");
    }
    coloring(n - 1, "sort");
}

//Insertion Sort
async function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        coloring(i, "current");
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            await sleep(delay);
            arr[j + 1] = arr[j];
            coloring(j + 1, "access");
            coloring(j, "current");
            j--;
        }
        arr[j + 1] = key;
        for (let elm = 0; elm <= i; elm++) {
            coloring(elm, "sort");
        }
    }
}

//Merge Sort
async function mergeSort(arr, low, high) {
    if (low >= high) {
        return;
    }
    let mid = Math.floor((low + high) / 2);
    await Promise.all([
        mergeSort(arr, low, mid),
        mergeSort(arr, mid + 1, high)
    ]);
    await merge(arr, low, mid, high);
    for (let elm = low; elm <= high; elm++) {
        coloring(elm, "sort");
    }
}

async function merge(arr, low, mid, high) {
    let n1 = mid - low + 1;
    let n2 = high - mid;
    let arrLeft = new Array(n1);
    let arrRight = new Array(n2);
    for (let i = 0; i < n1; i++) {
        arrLeft[i] = arr[low + i];
    }
    for (let j = 0; j < n2; j++) {
        arrRight[j] = arr[mid + 1 + j];
    }
    let i = 0, j = 0, k = low;
    while (i < n1 && j < n2) {
        coloring(low + i, "current");
        coloring(mid + 1 + j, "access");
        await sleep(delay);
        coloring(low + i, "off");
        coloring(mid + 1 + j, "off");
        if (arrLeft[i] <= arrRight[j]) {
            arr[k] = arrLeft[i];
            i++;
        }
        else {
            arr[k] = arrRight[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        coloring(k, "current");
        await sleep(delay);
        coloring(k, "off");
        arr[k] = arrLeft[i];
        i++;
        k++;
    }
    while (j < n2) {
        coloring(k, "current");
        await sleep(delay);
        coloring(k, "off");
        arr[k] = arrRight[j];
        j++;
        k++;
    }
}

//Quick Sort
async function quickSort(arr, low, high) {
    if (low >= high) {
        coloring(low, "sort");
        coloring(high, "sort");
        return;
    }
    let index = await partition(arr, low, high);
    await Promise.all([
        quickSort(arr, low, index),
        quickSort(arr, index + 1, high)
    ]);
}

async function partition(arr, low, high) {
    for (let i = low; i < high; i++) {
        if (states[i] != colors.sort) { coloring(i, "access"); }
    }
    let pivot = arr[Math.floor(Math.floor(low + high) / 2)];
    let i = low - 1, j = high + 1;
    while (true) {
        await sleep(delay);
        do {
            if (states[i] != colors.sort) { coloring(i, "off"); }
            i++;
            coloring(i, "current");
        } while (arr[i] < pivot);
        do {
            if (states[j] != colors.sort) { coloring(j, "off"); }
            j--;
            coloring(j, "current");
        } while (arr[j] > pivot);
        if (i >= j) {
            return j;
        }
        swap(arr, i, j);
    }
}

//Heap Sort
async function heapSort(arr) {
    let n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        coloring(i, "sort");
        swap(arr, 0, i);
        await heapify(arr, i, 0);
    }
    coloring(0, "sort");
}

async function heapify(arr, size, i) {
    let largest = i;
    let leftChild = 2 * i + 1;
    let rightChild = 2 * i + 2;
    if (states[largest] != colors.sort) { coloring(largest, "current"); }
    if (states[leftChild] != colors.sort) { coloring(leftChild, "access"); }
    if (states[rightChild] != colors.sort) { coloring(rightChild, "access"); }
    await sleep(delay);
    if (states[largest] != colors.sort) { coloring(largest, "off"); }
    if (states[leftChild] != colors.sort) { coloring(leftChild, "off"); }
    if (states[rightChild] != colors.sort) { coloring(rightChild, "off"); }
    if (leftChild < size && arr[leftChild] > arr[largest]) {
        largest = leftChild;
    }
    if (rightChild < size && arr[rightChild] > arr[largest]) {
        largest = rightChild;
    }
    if (largest != i) {
        swap(arr, i, largest);
        await heapify(arr, size, largest);
    }
}

//Radix Sort
async function radixSort(arr, n) {
    let m = await getMax(arr, n);
    for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
        await countSort(arr, n, exp);
    }
}

async function countSort(arr, n, exp) {
    let output = new Array(n);
    let count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) {
        count[Math.floor(arr[i] / exp) % 10]++;
    }
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    for (let i = n - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i] / exp) % 10]--;
    }
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        coloring(i, "current");
        await sleep(delay);
        coloring(i, "access");
    }
    for (let elm = 0; elm < n; elm++) {
        coloring(elm, "sort");
    }
}

async function getMax(arr, n) {
    let max = arr[0];
    for (let i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}