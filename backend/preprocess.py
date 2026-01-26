import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def preprocess_data(file_path):
    """
    Loads, cleans, and prepares the forest fire data for machine learning.
    
    Processes include:
    - Stripping whitespace from columns and values
    - Dropping redundant/leaky columns (Date, Day, Month, Year, FWI)
    - Encoding Classes (Fire -> 1, Not Fire -> 0)
    - Splitting data (80/20 train/test)
    - Scaling features using StandardScaler
    
    Returns:
        X_train, X_test, y_train, y_test, scaler
    """
    # 1. Load the dataset
    df = pd.read_csv(file_path)
    
    # 2. Clean column names (remove extra spaces + lowercase)
    df.columns = df.columns.str.strip().str.lower()
    
    # 3. Clean string values in the entire dataframe
    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    
    # 4. Encode the target column "classes"
    df['classes'] = df['classes'].str.lower().map({'fire': 1, 'not fire': 0})
    
    # 5. Handle missing values after mapping
    df = df.dropna(subset=['classes'])
    
    # 6. Drop unnecessary or "leaky" columns
    cols_to_drop = ['date', 'day', 'month', 'year', 'fwi']
    df = df.drop(columns=cols_to_drop, errors='ignore')
    
    # 7. Define our features (X) and target (y)
    FEATURES = [
        'temp', 'rh', 'ws', 'rain',
        'ffmc', 'dmc', 'dc', 'isi', 'bui'
    ]

    X = df[FEATURES]
    y = df['classes']
    
    # 8. Split into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # 9. Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


if __name__ == "__main__":
    import os
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, '..', 'data', 'forest_fires.csv')
    
    try:
        X_train, X_test, y_train, y_test, scaler = preprocess_data(data_path)
        print("--- Preprocessing Successful ---")
        print(f"Training features shape: {X_train.shape}")
        print(f"Testing features shape:  {X_test.shape}")
        print(f"Target distribution (Train): {y_train.value_counts().to_dict()}")
    except FileNotFoundError:
        print(f"Error: Could not find the dataset at {data_path}. Please check the file path.")
    except Exception as e:
        print(f"An error occurred: {e}")