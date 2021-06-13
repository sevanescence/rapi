#Descriptive Statistics, v. 1.0
#A program by Adrian Rodriguez
#Calculates measures of spread and central tendency chosen by user

#Function Declarations -------------------------------

Mode <- function(x) { #From Ken Williams on StackOverflow. Tabulates the data and finds multiple modes with high efficiency
  ux <- unique(x)
  tab <- tabulate(match(x, ux))
  ux[tab == max(tab)]
}

Range <- function(x) { #Whereas range(x) outputs a list of max and min, Range(x) computes its namesake
  range(x)[2] - range(x)[1]
}

Sdp <- function(x) { #Population standard deviation
  n <- length(x)
  populationFactor <- sqrt((n - 1) / n)
  
  populationFactor * sd(x)
  
}

#Input data processing -------------------------------

input <- commandArgs(trailingOnly = TRUE)
optionNum <- as.numeric(input[1])

sample <- as.numeric(input[2:length(input)])
options <- c(1, 2, 4, 8, 16, 32, 64)
optionsFilter <- bitwAnd(optionNum, options)

#Output Processing -------------------------------

funcList <- c("mean", "median", "Mode", "IQR", "Range", "sd", "Sdp") #list of function names. Those in CamelCase are user-defined

for (i in 1:length(funcList)) {
  if (optionsFilter[i]) {
    funcValue <- do.call(funcList[i], list(sample))
    cat(funcList[i], ":", funcValue, "\n")
  }
}