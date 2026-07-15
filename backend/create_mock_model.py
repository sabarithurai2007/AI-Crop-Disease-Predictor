import os

def main():
    print("Checking for TensorFlow installation...")
    try:
        import tensorflow as tf
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Rescaling
        
        print(f"TensorFlow v{tf.__version__} is installed. Building model...")
        
        # We have 13 classes in the database
        num_classes = 13
        
        # Build a very lightweight sequential model for image classification (224x224 RGB)
        model = Sequential([
            Rescaling(1./255, input_shape=(224, 224, 3)),
            Conv2D(8, 3, padding='same', activation='relu'),
            MaxPooling2D(),
            Flatten(),
            Dense(16, activation='relu'),
            Dense(num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Save model in standard Keras format
        model_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(model_dir, 'crop_disease_model.keras')
        model.save(model_path)
        
        print(f"Success! Model file created at: {model_path}")
        
    except ImportError:
        print("TensorFlow is not currently installed.")
        print("To compile a real Keras model, install tensorflow: py -m pip install tensorflow")
        print("Creating a simulated model placeholder file to represent the AI weights.")
        
        model_dir = os.path.dirname(os.path.abspath(__file__))
        placeholder_path = os.path.join(model_dir, 'crop_disease_model.keras')
        with open(placeholder_path, 'w') as f:
            f.write("SIMULATED_TENSORFLOW_MODEL_PLACEHOLDER")
        print(f"Created simulated model placeholder at: {placeholder_path}")

if __name__ == '__main__':
    main()
