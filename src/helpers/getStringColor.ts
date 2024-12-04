/**
 * MIT License
 *
 * Copyright (c) 2021 Vitaly Rtishchev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
**/

import type { MantineColor } from "@mantine/core"

function hashCode(input: string){
	let hash = 0

	for(let i = 0, { length } = input; i < length; i += 1){
		const char = input.charCodeAt(i)
		hash = (hash << 5) - hash + char
		hash |= 0
	}

	return hash
}

const defaultColors: MantineColor[] = [
	"blue",
	"cyan",
	"grape",
	"green",
	"indigo",
	"lime",
	"orange",
	"pink",
	"red",
	"teal",
	"violet"
]

export default function getStringColor(name: string, colors: MantineColor[] = defaultColors){
	const hash = hashCode(name)
	const index = Math.abs(hash) % colors.length
	return colors[index]
}
