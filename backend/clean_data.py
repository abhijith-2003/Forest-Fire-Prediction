import os
import pandas as pd

def clean_forest_fire_data(input_path, output_path):
    """
    Cleans the forest fire dataset for classification models.
    
    Tasks:
    1. Load CSV
    2. Remove exact duplicates
    3. Standardize column names
    4. Encode target 'classes'
    5. Drop unnecessary columns
    6. Handle missing values
    7. Save cleaned data
    """
    print(f"--- Loading data from {input_path} ---")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} does not exist.")
        return

    # 1. Load the dataset
    df = pd.read_csv(input_path)
    initial_rows = len(df)
    print(f"Initial row count: {initial_rows}")

    # 2. Remove exact duplicate rows
    df = df.drop_duplicates()
    rows_after_duplicates = len(df)
    print(f"Rows after removing duplicates: {rows_after_duplicates}")

    # 3. Standardize column names (lowercase, strip whitespace)
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
    print(f"Standardized columns: {list(df.columns)}")

    # 4. Convert target column 'classes'
    # "fire" -> 1, "not fire" -> 0
    if 'classes' in df.columns:
        # Standardize strings in the column first
        df['classes'] = df['classes'].astype(str).str.strip().str.lower()
        mapping = {'fire': 1, 'not fire': 0}
        df['classes'] = df['classes'].map(mapping)
        
        # 6. Handle missing values (specifically in 'classes' after mapping)
        # If any value didn't match 'fire' or 'not fire', it becomes NaN
        df = df.dropna(subset=['classes'])
    else:
        print("Warning: 'classes' column not found.")

    # 5. Drop unnecessary columns (day, month, year)
    cols_to_drop = ['day', 'month', 'year']
    df = df.drop(columns=cols_to_drop, errors='ignore')
    print(f"Dropped columns: {cols_to_drop}")

    # 6. Handle remaining missing values
    # For a classification model, we'll drop rows with any missing features
    df = df.dropna()
    final_rows = len(df)
    print(f"Final row count: {final_rows}")
    print(f"Total rows removed: {initial_rows - final_rows}")

    # 7. Save the cleaned dataset
    df.to_csv(output_path, index=False)
    print(f"--- Cleaned dataset saved to {output_path} ---")

if __name__ == "__main__":
    # Setup paths relative to script location
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, '..', 'data')
    
    input_file = os.path.join(data_dir, 'forest_fires.csv')
    output_file = os.path.join(data_dir, 'forest_fire_cleaned.csv')
    
    clean_forest_fire_data(input_file, output_file)
