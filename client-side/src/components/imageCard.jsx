//This component will represent each image in the gallery. It will handle the logic for selecting an image, setting a feature image, and deleting an image.

// src/components/imageCard.js
import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import './imageCard.css'

const ItemType = 'image'

function ImageCard({
  id,
  image,
  index,
  isFeatured,
  moveImage,
  onSelect,
  onSetFeature,
}) {
  const [, ref] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        moveImage(item.index, index)
        item.index = index
      }
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1

  const [selected, setSelected] = useState(false)

  const handleSelect = () => {
    setSelected(!selected)
    onSelect(id, !selected)
  }

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`image-card ${isFeatured ? 'featured' : ''} ${
        selected ? 'selected' : ''
      }`}
    >
      <img ref={drag} src={image.src} alt='' className='image' />
      <input
        type='checkbox'
        checked={selected}
        onChange={handleSelect}
        className={`checkbox ${selected ? 'selected' : ''}`}
      />
      {!isFeatured && (
        <button onClick={() => onSetFeature(id)} className='feature-button'>
          Set as Feature
        </button>
      )}
    </div>
  )
}

export default ImageCard



